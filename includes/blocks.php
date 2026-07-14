<?php
/**
 * Block registration.
 *
 * @package WPBlocksStarter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Log a build failure and schedule one admin notice.
 *
 * @param string $message Failure message.
 * @param array  $context Failure context.
 * @return void
 */
function wpbs_report_build_failure( $message, array $context = array() ) {
	static $notice_scheduled = false;

	wpbs_log( 'ERROR', $message, $context );

	if ( $notice_scheduled ) {
		return;
	}

	add_action( 'admin_notices', 'wpbs_missing_build_notice' );
	$notice_scheduled = true;
}

/**
 * Register compiled block manifests.
 *
 * @return void
 */
function wpbs_register_blocks() {
	$build_dir = WPBS_PLUGIN_DIR . 'build';

	if ( ! is_dir( $build_dir ) || ! is_readable( $build_dir ) ) {
		wpbs_report_build_failure(
			'Compiled build directory is unavailable.',
			array( 'directory' => $build_dir )
		);
		return;
	}

	$manifest_pattern = $build_dir . '/*/block.json';
	$manifest_paths   = glob( $manifest_pattern );

	if ( false === $manifest_paths ) {
		wpbs_report_build_failure(
			'Compiled block manifest scan failed.',
			array( 'pattern' => $manifest_pattern )
		);
		return;
	}

	if ( empty( $manifest_paths ) ) {
		wpbs_report_build_failure(
			'No compiled block manifests were found.',
			array( 'pattern' => $manifest_pattern )
		);
		return;
	}

	if ( ! function_exists( 'register_block_type' ) ) {
		wpbs_report_build_failure( 'WordPress block registration is unavailable.' );
		return;
	}

	foreach ( $manifest_paths as $manifest_path ) {
		if ( ! is_file( $manifest_path ) || ! is_readable( $manifest_path ) ) {
			wpbs_report_build_failure(
				'Compiled block manifest is unavailable.',
				array( 'manifest' => $manifest_path )
			);
			continue;
		}

		try {
			$registered_block = register_block_type( dirname( $manifest_path ) );
		} catch ( Throwable $exception ) {
			wpbs_report_build_failure(
				'Compiled block registration threw an exception.',
				array(
					'manifest' => $manifest_path,
					'message'  => $exception->getMessage(),
				)
			);
			continue;
		}

		if ( is_wp_error( $registered_block ) ) {
			wpbs_report_build_failure(
				'Compiled block registration returned an error.',
				array(
					'manifest' => $manifest_path,
					'code'     => $registered_block->get_error_code(),
					'message'  => $registered_block->get_error_message(),
				)
			);
			continue;
		}

		if ( false === $registered_block ) {
			wpbs_report_build_failure(
				'Compiled block registration failed.',
				array( 'manifest' => $manifest_path )
			);
		}
	}
}

/**
 * Show the missing-build notice to plugin administrators.
 *
 * @return void
 */
function wpbs_missing_build_notice() {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	?>
	<div class="notice notice-warning"><p><?php esc_html_e( 'WP Blocks Starter: run `npm run build` to compile blocks', 'wp-blocks-starter' ); ?></p></div>
	<?php
}
