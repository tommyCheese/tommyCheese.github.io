function readingTime() {
  const text = document.querySelector("article").innerText;
  const wpm = 225;
  const words = text.trim().length;
  // const words = text.trim().length;.split(/\s+/)
  const time = Math.ceil(words / wpm);
  const timeElement = document.querySelector("span#readingTime");
  timeElement.innerHTML = "<small> | </small>" + "阅读需要 " + time + timeElement.innerHTML;
}
readingTime();
