<?php
/**
 * Plugin Name:       WP Blocks Starter
 * Description:       A modern starter for building WordPress blocks.
 * Version:           1.0.0
 * Requires at least: 6.6
 * Requires PHP:      8.0
 * License:           MIT
 * Text Domain:       wp-blocks-starter
 * Domain Path:       /languages
 *
 * @package WPBlocksStarter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WPBS_VERSION', '1.0.0' );
define( 'WPBS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WPBS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Write a structured debug log entry.
 *
 * @param string $level   Log level.
 * @param string $message Log message.
 * @param array  $context Additional context.
 * @return void
 */
function wpbs_log( $level, $message, array $context = array() ) {
	if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
		return;
	}

	$allowed_levels = array( 'DEBUG', 'INFO', 'WARNING', 'ERROR' );
	$level          = is_string( $level ) ? strtoupper( $level ) : 'INFO';
	$message        = is_string( $message ) ? $message : 'Invalid log message.';

	if ( ! in_array( $level, $allowed_levels, true ) ) {
		$level = 'INFO';
	}

	$encoded_context = empty( $context ) ? '{}' : wp_json_encode( $context );

	if ( false === $encoded_context ) {
		$encoded_context = '{"encoding_error":true}';
	}

	$log_line = sprintf(
		'[wp-blocks-starter] %1$s %2$s %3$s',
		$level,
		$message,
		$encoded_context
	);

	// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- Centralized debug-only logging helper.
	if ( false === error_log( $log_line ) ) {
		return;
	}
}

/**
 * Load plugin modules and register their hooks.
 *
 * @return void
 */
function wpbs_bootstrap() {
	$include_files = array(
		WPBS_PLUGIN_DIR . 'includes/blocks.php',
		WPBS_PLUGIN_DIR . 'includes/i18n.php',
	);

	foreach ( $include_files as $include_file ) {
		if ( ! is_file( $include_file ) || ! is_readable( $include_file ) ) {
			wpbs_log(
				'ERROR',
				'Required plugin file is unavailable.',
				array( 'file' => $include_file )
			);
			continue;
		}

		try {
			require_once $include_file;
		} catch ( Throwable $exception ) {
			wpbs_log(
				'ERROR',
				'Required plugin file could not be loaded.',
				array(
					'file'    => $include_file,
					'message' => $exception->getMessage(),
				)
			);
		}
	}

	if ( function_exists( 'wpbs_load_textdomain' ) ) {
		add_action( 'init', 'wpbs_load_textdomain', 1 );
	} else {
		wpbs_log( 'ERROR', 'Text domain loader is unavailable.' );
	}

	if ( function_exists( 'wpbs_register_blocks' ) ) {
		add_action( 'init', 'wpbs_register_blocks' );
	} else {
		wpbs_log( 'ERROR', 'Block registrar is unavailable.' );
	}
}

wpbs_bootstrap();
