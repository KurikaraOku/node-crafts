window.onload = () => {
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close");
    const addLink = document.getElementById("add-link");
    const addModal = document.getElementById("add-craft-modal");
    const cancelButton = document.getElementById("cancel");
    const addCraftForm = document.getElementById("add-edit-craft-form");

    // Function to clear input fields in the add craft modal
    const resetForm = () => {
        const form = document.getElementById("add-edit-craft-form");
        form.reset();
        form._id = "-1";
        document.getElementById("supply-boxes").innerHTML = "";
        document.getElementById("img").value = ""; 
        document.getElementById("img-prev").src = "";
    };

   // Function to add craft
const addCraft = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const form = document.getElementById("add-edit-craft-form");
    const formData = new FormData(form);
    formData.append("supplies", getSupplies());
    
    let response;
    
    // new recipe
    if(form._id.value == -1){
    formData.delete("_id");
    
    response = await fetch("/api/crafts", {
    method: "POST",
    body: formData,
    });
    }
    
    // error call
    if(response.status != 200){
    console.log("error contacting api server");
    return;
    }

    document.getElementById("add-craft-modal").style.display = "none";
    resetForm();
    showCrafts();
    };


    const getSupplies = () => {
        const inputs = document.querySelectorAll("#supply-boxes input");
        const supplies = [];

        inputs.forEach((input) => {
            supplies.push(input.value);
        });

        return supplies;
    };

    // Event listener for form submission
addCraftForm.addEventListener("submit", addCraft);

    // Function to show the crafts
    const showCrafts = async () => {
        try {
            const response = await fetch("/api/crafts");
            const crafts = await response.json();
            const craftDiv = document.getElementById("craft-list");
            craftDiv.classList.add("flex-container");

            crafts.forEach((craft) => {
                const section = document.createElement("section");
                section.classList.add("flex-item");

                const img = document.createElement("img");
                img.src = craft.image ? "/crafts/" + craft.image : "";

                img.addEventListener("click", () => {
                    const modal = document.getElementById("myModal");
                    const modalTitle = modal.querySelector("#modal-title");
                    const modalImg = modal.querySelector("#modal-img");
                    const modalDescription = modal.querySelector("#modal-description");
                    const modalSupplies = modal.querySelector("#modal-supplies");

                    modalTitle.textContent = craft.name;
                    modalImg.src = img.src;
                    modalDescription.textContent = craft.description;

                    modalSupplies.innerHTML = "";
                    craft.supplies.forEach((supply) => {
                        const li = document.createElement("li");
                        li.textContent = supply;
                        modalSupplies.appendChild(li);
                    });

                    modal.style.display = "block";
                });

                section.appendChild(img);
                craftDiv.appendChild(section);
            });
        } catch (error) {
            console.error("Error fetching crafts:", error);
        }
    };

    // Close modals when clicking the close button (x)
    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modals.forEach((modal) => {
                modal.style.display = "none";
                if (modal === addModal) {
                    resetForm(); // Reset the form and clear input fields when closing add modal
                }
            });
        });
    });

    // Close modals when clicking outside the box
    window.addEventListener("click", (event) => {
        modals.forEach((modal) => {
            if (event.target === modal) {
                modal.style.display = "none";
                if (modal === addModal) {
                    resetForm(); // Reset the form and clear input fields when closing add modal
                }
            }
        });
    });

    // Show add craft modal when clicking the "+" link
    addLink.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default link behavior
        addModal.style.display = "block";
    });

    // Close add craft modal and reset the form when clicking "Cancel"
    cancelButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default button behavior
        addModal.style.display = "none"; // Close the add craft modal
        resetForm(); // Reset the form and clear input fields
    });

    const addSupply = (e) => {
        e.preventDefault();
        console.log("add a supply")
    const supplyBoxes = document.getElementById("supply-boxes");
    const input = document.createElement("input");
    input.type = "text";
    supplyBoxes.append(input);
    };
    // Call the function to show crafts when the window loads
    showCrafts();
    document.getElementById("add-supply").onclick = addSupply;

    document.getElementById("img").onchange = (e) => {
  if (!e.target.files.length) {
    document.getElementById("img-prev").src = "";
    return;
  }
  document.getElementById("img-prev").src = URL.createObjectURL(
    e.target.files.item(0)
  );
};

};