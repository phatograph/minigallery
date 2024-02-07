# Mini Gallery

Mini Gallery is a replica of Apple.com's [products navigation panel](http://www.apple.com/mac/). You can see a demo [here](http://phatograph.github.io/minigallery/).

Usage and default values:

```javascript
$('#miniGallery').miniGallery({
  width: 150, // width of each image
  height: 150, // height of each image
  offset: 3000, // amount of length images would be kept aside before sliding in
  delay: 50, // delay between each image animation
  padding: 5, // padding of each image
  animateDurationOut: 800, // duration of leaving images animation
  animateDurationIn: 200, // duration of incoming images animation
  easeOut: 'easeInOutElastic', // type of leaving images animation
  easeIn: 'easeInQuint' // type of incoming images animation
});
```

Enjoy!
