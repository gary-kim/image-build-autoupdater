package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var Version = "v0.0.1"

func init() {
	versionCmd := &cobra.Command{
		Use: "version",
		Short: "Print version number of image-build-autoupdater",
		Run: func(command *cobra.Command, args []string) {
			fmt.Printf("image-build-autoupdater - Version %s\n", Version)
		},
	}
	Root.AddCommand(versionCmd)
}
