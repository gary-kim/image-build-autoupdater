package update

import (
	"fmt"

	"github.com/spf13/cobra"
)

var Version = "v0.0.1"

func init() {
	versionCmd := &cobra.Command{
		Use: "update",
		Short: "update a configured program",
		Run: func(command *cobra.Command, args []string) {
			fmt.Printf("image-build-autoupdater - Version %s\n", Version)
		},
	}
	Root.AddCommand(versionCmd)
}
