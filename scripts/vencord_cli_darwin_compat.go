//go:build darwin && cli

package main

// ParseDiscordNew handles Discord's newer Windows/Linux layouts upstream.
// The CLI references it on every platform, although macOS uses ParseDiscord.
func ParseDiscordNew(_ string, _ string, _ bool) *DiscordInstall {
	return nil
}
