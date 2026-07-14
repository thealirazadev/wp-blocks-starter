<?php
/**
 * Internationalization setup.
 *
 * @package WPBlocksStarter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the plugin translation path.
 *
 * @return void
 */
function wpbs_load_textdomain() {
	$plugin_relative_path = dirname(
		plugin_basename( WPBS_PLUGIN_DIR . 'wp-blocks-starter.php' )
	) . '/languages';

	try {
		$loaded = load_plugin_textdomain(
			'wp-blocks-starter',
			false,
			$plugin_relative_path
		);
	} catch ( Throwable $exception ) {
		wpbs_log(
			'ERROR',
			'Plugin text domain could not be loaded.',
			array( 'message' => $exception->getMessage() )
		);
		return;
	}

	if ( ! $loaded ) {
		wpbs_log(
			'WARNING',
			'Plugin text domain was not loaded.',
			array( 'path' => $plugin_relative_path )
		);
	}
}
