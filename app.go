package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"os"

	"github.com/disintegration/imaging"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) ResizeImages(width int, height int, base64Images []string) ([]string, error) {
	var resizedImages []string

	for i, base64Img := range base64Images {
		imgData, err := base64.StdEncoding.DecodeString(base64Img)

		if err != nil {
			return nil, fmt.Errorf("Error decoding image %d: %v", i, err)
		}

		img, _, err := image.Decode(bytes.NewReader(imgData))

		if err != nil {
			return nil, fmt.Errorf("Error decoding image %d: %v", i, err)
		}

		resized := imaging.Resize(img, width, height, imaging.Lanczos)

		var buf bytes.Buffer

		err = imaging.Encode(&buf, resized, imaging.JPEG)

		if err != nil {
			return nil, fmt.Errorf("Error encoding image %d: %v", i, err)
		}

		resizedBase64 := base64.StdEncoding.EncodeToString(buf.Bytes())

		resizedImages = append(resizedImages, resizedBase64)
	}

	return resizedImages, nil
}

func (a *App) SaveImages(base64Images []string) (string, error) {
	// Open directory picker dialog
	directory, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select folder to save resized images",
	})

	if err != nil {
		return "", fmt.Errorf("Error opening directory dialog: %v", err)
	}

	// User cancelled the dialog
	if directory == "" {
		return "", fmt.Errorf("No directory selected")
	}

	// Save each image
	for i, base64Img := range base64Images {
		imgData, err := base64.StdEncoding.DecodeString(base64Img)
		if err != nil {
			return "", fmt.Errorf("Error decoding image %d: %v", i, err)
		}

		filename := fmt.Sprintf("%s/resized_image_%d.jpg", directory, i+1)
		err = os.WriteFile(filename, imgData, 0644)
		if err != nil {
			return "", fmt.Errorf("Error saving image %d: %v", i, err)
		}
	}

	return fmt.Sprintf("Successfully saved %d images to %s", len(base64Images), directory), nil
}
