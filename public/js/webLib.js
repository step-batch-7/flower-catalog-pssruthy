const hideForOneSec = function () {
  const jar = document.getElementById('jarGIF');
  jar.style.visibility = 'hidden';

  setTimeout(() => jar.style.visibility = 'visible', 1000);
}