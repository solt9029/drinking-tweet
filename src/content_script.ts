import * as $ from "jquery";

$(async function () {
  let port;
  const threshold = 600;
  let sensorValue = threshold; // initial value
  const buttonClassName = "css-901oao css-16my406 r-1tl8opc r-bcqeeo r-qvutc0";

  if (location.href === "https://solt9029.github.io/drinking-sudo/") {
    return;
  }

  try {
    port = await (navigator as any).serial.requestPort();
    await port.open({ baudRate: 9600 });
    console.log("connect");

    Array.from(document.getElementsByTagName("div")).forEach((element) => {
      element.addEventListener("click", function (event) {
        console.log((event.target as any).className);
        if (
          (event.target as any).className === buttonClassName &&
          sensorValue >= threshold
        ) {
          event.stopPropagation();
          window.open("https://solt9029.github.io/drinking-sudo/");
        }
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

          sensorValue = parseInt(decodedValue);
          console.log(sensorValue);
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
