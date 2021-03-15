import * as $ from "jquery";

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

$(async function () {
  if (location.href === "http://localhost:5000") {
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
    console.log("connect success");

    async function handleClick(event) {
      console.log(event.target);

      if (
        (event.target as HTMLElement).className !== tweetElement.className ||
        event.isTrusted === false
      ) {
        return true;
      }

      homeElement.innerHTML = "センサーに息を吹きかけてください";
      event.stopPropagation();

      await sleep(5000);

      if (
        sensorValues
          .slice(sensorValues.length - 10)
          .some((value) => value >= threshold)
      ) {
        window.open("http://localhost:5000");
        return;
      }

      console.log("tweet success");
      event.target.dispatchEvent(new Event("click", { bubbles: true }));
    }

    Array.from(document.getElementsByTagName("div")).forEach((element) => {
      element.addEventListener("click", handleClick);
    }, false);

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
