import createPixelArt from './createPixelArt'

const images = ['vector_tomato.png', 'pickle.png', 'seattle.png', 'meteor-dribbble.png', 'bacon.png', 'bb8.png', 'avatar-rogemon.png', 'dropbox_bear.png', 'chieftain.jpg', 'fireart_blog.jpg']

images.forEach(src => {
	createPixelArt({pixel: 4, row: 100}, src, (image, canvas) => {
		document.body.appendChild(image)
	})
})