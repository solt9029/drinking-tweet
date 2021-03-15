import * as $ from "jquery";

$(async function () {
  if (location.href === "https://solt9029.github.io/drinking-sudo/") {
    return;
  }

  let port;
  const threshold = 600;
  let sensorValues = []; // initial value
  let homeElement;
  let tweetElement;

  Array.from(document.getElementsByTagName("span")).forEach((element) => {
    if (element.innerHTML === "Home") {
      homeElement = element;
    }
    if (element.innerHTML === "Tweet") {
      tweetElement = element;
    }
  });

  try {
    port = await (navigator as any).serial.requestPort();
    await port.open({ baudRate: 9600 });
    console.log("connect");

    Array.from(document.getElementsByTagName("div")).forEach((element) => {
      element.addEventListener("click", function (event) {
        console.log((event.target as HTMLElement).className);
        homeElement.innerHTML = "センサーに息を吹きかけてください";
        setTimeout(() => {
          if (
            (event.target as HTMLElement).className ===
              tweetElement.className &&
            sensorValues.slice(sensorValues.length - 10).some((value) => {
              value >= threshold;
            })
          ) {
            event.stopPropagation();
            window.open("https://solt9029.github.io/drinking-sudo/");
          }
        }, 5000);
      });
    });

    while (port.readable) {
      const reader = port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const decodedValue = new TextDecoder().decode(value);
          sensorValues.push(parseInt(decodedValue));
          console.log(parseInt(decodedValue));
        }
      } catch (err) {
        console.log(err);
      } finally {
        reader.releaseLock();
      }
    }
  } catch (err) {
    console.log(err);
  }
});
