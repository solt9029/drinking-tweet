import * as $ from "jquery";

$(function () {
  let port;
  let sensorValue = 600;

  (async function () {
    try {
      port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      console.log("接続");

      while (port.readable) {
        const reader = port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            const decodedValue = new TextDecoder().decode(value);

            if (done) {
              break;
            }

            console.log(decodedValue);
            sensorValue = parseInt(decodedValue);
          }
        } catch (error) {
          console.log(error);
        } finally {
          reader.releaseLock();
        }
      }
    } catch (e) {
      console.log(e);
    }
  })();

  Array.from(document.getElementsByTagName("div")).forEach((element) => {
    element.addEventListener("click", function (event) {
      if (
        (event.target as any).className ===
          "css-901oao css-16my406 r-1tl8opc r-bcqeeo r-qvutc0" &&
        sensorValue >= 600
      ) {
        event.stopPropagation();
        window.open("https://solt9029.github.io/drinking-sudo/");
      }
    });
  });
});
