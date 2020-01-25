const hideForOneSec = function () {
  const jar = document.getElementById('jarGIF');
  const coverJar = document.getElementById('coverJar');
  jar.style.display = 'none';
  coverJar.style.display = 'block';
  
  setTimeout(() => {
    jar.style.display = 'block';
    coverJar.style.display = 'none';
  }, 1000);
}
