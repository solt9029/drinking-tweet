import * as $ from "jquery";

$(function () {
  let port;
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
            // https://solt9029.github.io/drinking-sudo/
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
});
