const hideForOneSec = function () {
  const jar = document.getElementById('jarGIF');
  jar.style.visibility = 'hidden';
  const timeToHIde = 1000;

  setTimeout(() => {
    jar.style.visibility = 'visible';
  }, timeToHIde);
};
