"use strict";

if (typeof window === "null" || typeof window === "undefined") // imports to aid VSCode Intellisense
{
    import("../../js/classes/UIEx.js");
}

function changeFontSize(clickEvent, increment)
{
    let cell = (clickEvent instanceof HTMLElement ? clickEvent : clickEvent.target.uiEx.parentUIEx.container.parentElement);

    if (cell.tagName.toLowerCase() === "th")
    {
        document.querySelectorAll("[data-parent-header-name=" + cell.dataset.headerName + "]").forEach(headerCell=>{
            changeFontSize(headerCell, increment);
        });

        document.querySelectorAll("." + cell.dataset.headerName).forEach(dataCell=>{
            changeFontSize(dataCell, increment);
        });
    }
    else
    {
        if (increment === 0)
        {
            cell.style.fontSize = null;
            if (cell.style == '')
            {
                cell.removeAttribute("style");
            }
        }
        else
        {
            if (!cell.style.fontSize)
            {
                cell.style.fontSize = "100%";
            }
    
            cell.style.fontSize = (parseFloat(cell.style.fontSize) + increment) + "%";
    
            if (parseFloat(cell.style.fontSize) <= 0)
            {
                cell.style.fontSize = increment + "%";
            }
        }
    }
}

function decreaseFontSize(clickEvent)
{
    changeFontSize(clickEvent, -10);
}

function increaseFontSize(clickEvent)
{
    changeFontSize(clickEvent, 10);
}

function resetFontSize(clickEvent)
{
    changeFontSize(clickEvent, 0);
}

document.querySelectorAll("[data-header-name]").forEach(headerCell=>{
    let btns = new ButtonGroupEx();

    btns.setup(headerCell, "button");
    headerCell.prepend(btns.container);
    btns.container.classList.add("sr-font-size-controls");

    btns.addButton("-", "button", "Decrease font size", decreaseFontSize);
    btns.addButton("A", "button", "Reset font size", resetFontSize);
    btns.addButton("+", "button", "Increase font size", increaseFontSize);
    btns.spacer[0].remove();
    btns.spacer[1].remove();
    btns.spacer[2].remove();
    btns.spacer[3].remove();
});

document.querySelectorAll(".sr-table td").forEach(headerCell=>{
    let btns = new ButtonGroupEx();

    btns.setup(headerCell, "button");
    headerCell.prepend(btns.container);
    btns.container.classList.add("sr-font-size-controls");

    btns.addButton("-", "button", "Decrease font size", decreaseFontSize);
    btns.addButton("A", "button", "Reset font size", resetFontSize);
    btns.addButton("+", "button", "Increase font size", increaseFontSize);
    btns.spacer[0].remove();
    btns.spacer[1].remove();
    btns.spacer[2].remove();
    btns.spacer[3].remove();
});