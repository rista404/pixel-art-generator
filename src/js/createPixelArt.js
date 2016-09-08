// createCanvas :: Object -> CanvasNode
function createCanvas({ id, width, height } = {}) {
	const canvas = document.createElement('canvas')
	if( id ) canvas.id = id
	if( width ) canvas.width = width
	if( height ) canvas.height = height
	return canvas
}

// getCanvasContext :: CanvasNode -> CanvasRenderingContext2D
function getCanvasContext(canvas) {
	return canvas.getContext('2d')
}

// drawImage :: CanvasContext -> ImageNode -> Object{row} -> undefined
function drawImage(ctx, img, { row }) {
	ctx.drawImage(img, 0, 0, row, img.height / img.width * row)
}

// createImage :: String -> Function -> ImageNode
function createImage(src, cb) {
	const img = new Image()
	img.src = src
	img.onload = cb(img)
	return img
}

// getImageData :: CanvasContext -> ImageNode -> Object{row} -> [Number]
function getImageData(ctx, img, {row}) {
	const imageData = ctx.getImageData(0, 0, row, img.height / img.width * row)
	return imageData ? Array.from(imageData.data) : []
}

// getCanvasColor :: CanvasContext -> ImageNode -> Object -> [Color]
function getCanvasColors(ctx, img, options) {
	const imageData = getImageData(ctx, img, options)

	const colors = imageData.reduce((colors, currPixel, currPixelIndex, allPixels) => {
		// every fourth color
		if(currPixelIndex % 4 === 0) {
			const pixelColor = {
				r: currPixel,
				g: allPixels[currPixelIndex + 1],
				b: allPixels[currPixelIndex + 2],
				a: allPixels[currPixelIndex + 3] ? allPixels[currPixelIndex + 3] / 255 : 0
			}

			// if alpha/opacity is 0, just push string 'transparent' for that pixel
			if(pixelColor.a === 0) {
				colors.push('transparent')
			}
			else {
				colors.push(pixelColor)
			}
		}

		// return updated array of pixel colors
		return colors
	}, [])

	// return the final list
	return colors
}

// drawCanvas :: Canvas -> [Color] -> Object{row, pixel} -> Canvas
function drawCanvas(canvas, colors, options) {
	const ctx = getCanvasContext(canvas)
	const { row, pixel } = options
	let y = -1

	colors.forEach((color, index) => {
		let x = index % row

		if (x === 0) ++y

		if (color !== 'transparent') {
			const { r, g, b, a } = color
			
			ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
			ctx.fillRect(x * pixel, y * pixel, pixel, pixel)
		}
	})

	return canvas
}

// onImageLoad :: CanvasContext -> Object{row, pixel} -> Function -> ( Function -> Function )
function onImageLoad(ctx, options, callback) {
	return (img) => () => {
		drawImage(ctx, img, options)

		const colors = getCanvasColors(ctx, img, options)

		const blankPixelArtCanvas = createCanvas({ 
			// id: 'pixelArt',
			width: options.row * options.pixel,
			height: (img.height / img.width * options.row) * options.pixel
		})

		const pixelArtCanvas = drawCanvas(blankPixelArtCanvas, colors, options)

		const pixelArtImage = convertCanvasToImage(pixelArtCanvas)

		callback(pixelArtImage, pixelArtCanvas)
	}
}

// createPixelArtImage :: Object{row, pixel} -> Function -> undefined
 function createPixelArtImage(options, callback) {
	const canvas = createCanvas()
	const ctx = getCanvasContext(canvas)

	const img = createImage(options.src, onImageLoad(ctx, options, callback) )
}

// convertCanvasToImage :: Canvas -> ImageNode
function convertCanvasToImage(canvas) {
	var img = new Image()
	img.src = canvas.toDataURL("image/png")
	return img
}

// createPixelArt :: Object -> String -> Function -> undefined
export default function createPixelArt(config, src, callback) {
	const options = { ...config, row: 60, pixel: 10 }

	if( !src ) throw new TypeError("Please specify images in a string format, or an array")

	createPixelArtImage({...options, src}, callback)
}





