package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var Root = &cobra.Command{
	Use: "image-build-autoupdater",
	Short: "image-build-autoupdater is a simple program to update version files in build repos",
	Version: Version,
}

var configLocation = "./config.json"
var stateLocation = "./state.json"

func Execute() {
	if err := Root.Execute(); err != nil {
		fmt.Printf("Error parsing command: %s\n", err)
		os.Exit(1)
	}
}

func init() {
	Root.SetVersionTemplate("{{.Name}} - Version {{.Version}}\n")
	Root.PersistentFlags().StringVar(&configLocation, "config", "config.json", "Specify the location of the config file")
	Root.PersistentFlags().StringVar(&stateLocation, "state", "state.json", "Specify the location of the state file")
}
