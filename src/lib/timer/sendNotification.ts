const playSound = (audio: string) => {
  const audioObject = new Audio("/ring.mp3"); // Remplacez par le chemin vers votre fichier sonore
  audioObject.play();
};
export const sendNotification = ({
  title = "Timer",
  body = "Elapsed time.",
  icon = "/bell-ring.png",
  audio = "/ring.mp3",
}) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon,
    });
    playSound(audio);
  }
};
