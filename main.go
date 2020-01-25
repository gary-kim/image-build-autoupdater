package main

import (
	"github.com/gary-kim/image-build-autoupdater/cmd"
	_ "github.com/gary-kim/image-build-autoupdater/cmd/all"
)

func main() {
	cmd.Execute()
}
