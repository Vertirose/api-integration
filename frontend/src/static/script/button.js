const btn = document.getElementById("mailButton");

btn.addEventListener("click", async () => {
  // Activate the afterAnimation state
  document.documentElement.classList.add("afterAnimation");

  // Reset to default state
  btn.classList.remove("button-success", "button-failure");

  try {
    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", response);

    if (!response.ok) {
      throw new Error(
        "I think there's a problem with this: " + response.statusText
      );
    }

    btn.classList.add("button-success");

    await Swal.fire({
      icon: "success",
      title: "Haha, Email was sent successfully!",
      confirmButtonText: "OK! Thanks a lot!",
      background: "#1c1c1e",
      color: "#e5e5e5",
    });
  } catch (error) {
    console.error("Error:", error);
    btn.classList.add("button-failure");

    await Swal.fire({
      icon: "error",
      title: "Sorry, Email was not sent",
      text: error.message,
      confirmButtonText: "Why?",
      background: "#1c1c1e",
      color: "#e5e5e5",
    });
  } finally {
    setTimeout(() => {
      btn.classList.remove("button-success", "button-failure");
      btn.style.transition = "background-color 0.5s ease";
      document.documentElement.classList.remove("afterAnimation");
    }, 2000);
  }
});
