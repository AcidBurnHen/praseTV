import { reorderIdxOnBookmarks } from "./bookmarks"
import globalState from "./global"
import { getFocusedElementUrl, toggleFocusedElement } from "./utils"


export function handleGlobalKeyboardControls(e: KeyboardEvent) {
    if (!globalState.focusedSection && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const firstELement = document.getElementById('bookmark-0')
        if (firstELement) {
            toggleFocusedElement(firstELement)
            globalState.focusedSection = globalState.bookmarks.sectionContainer
            globalState.bookmarks.focused = firstELement
        }
    }

    if (globalState.focusedSection === null) {
        return 
    }

    if (globalState.focusedSection.id === globalState.bookmarks.sectionContainer.id) {
        console.log("Bookmark control")
        handleBookmarkKeyboardControls(e)
    }

    handleSectionsKeyboardControls(e)
}


function handleSectionsKeyboardControls(e: KeyboardEvent) {
    if (!e.ctrlKey || !globalState.focusedSection) {
        return 
    }

    if (!['ArrowUp', 'ArrowDown'].includes(e.key)) {
        return 
    }

    if (!globalState.allSections.includes(globalState.focusedSection.id)) {
        return 
    }
    
    const focusedSectionIndex = globalState.allSections.indexOf(globalState.focusedSection.id)
    
    switch (e.key) {
        case 'ArrowUp': {
            if (focusedSectionIndex <= 0) {
                break 
            }

            const toFocusSectionId = globalState.allSections[focusedSectionIndex - 1]

            const toFocusSection = document.getElementById(toFocusSectionId)
            if (toFocusSection) {
                toggleFocusedElement(toFocusSection, globalState.focusedElement)
                globalState.focusedSection = toFocusSection
            }
    
            break 
        }
        case 'ArrowDown': {
            console.log("Down")

            if (focusedSectionIndex >= (globalState.allSections.length - 1)) {
                break 
            }

            const toFocusSectionId = globalState.allSections[focusedSectionIndex + 1]
            const toFocusSection = document.getElementById(toFocusSectionId)
            if (toFocusSection) {
                toggleFocusedElement(toFocusSection, globalState.focusedElement)
                globalState.focusedSection = toFocusSection
            }

            break 
        }
    }
}


function handleBookmarkKeyboardControls (e: KeyboardEvent) {
    if (globalState.bookmarks.focused === null) {
        const firstELement = document.getElementById('bookmark-0')
        if (firstELement) {
            toggleFocusedElement(firstELement)
            globalState.focusedSection = globalState.bookmarks.sectionContainer
            globalState.bookmarks.focused = firstELement
        }
    }

    if (globalState.bookmarks.focused === null) {
        return 
    }

    if (e.ctrlKey) {
        return 
    }

    let focusedElement = globalState.bookmarks.focused

    console.log("Here", focusedElement)

    switch (e.key) {
        case 'Delete': {     
            window.postMessage({ action: 'deleteBookmark', id: focusedElement.dataset.bId }, '*')

            const deletedId = focusedElement.dataset.bId
            globalState.bookmarks.all = globalState.bookmarks.all.filter(b => String(b.ID) !== deletedId)

            let oldIdx = Number(focusedElement.dataset.idx)
            focusedElement.remove()
            globalState.bookmarks.total--

            reorderIdxOnBookmarks()

            if (oldIdx >= globalState.bookmarks.total) {
                oldIdx = globalState.bookmarks.total - 1    
            } 

            const newElementToFocus = document.querySelector(`#bookmark-${oldIdx}`) as HTMLElement
            console.log("new focused element: ", newElementToFocus)
            if (newElementToFocus) {
                focusedElement = toggleFocusedElement(newElementToFocus, focusedElement)
            }

            break
        }
        case 'Enter': { 
            const url = getFocusedElementUrl(focusedElement)
            if (!url) {
                break 
            }

            window.postMessage({ action: 'openBookmark', url }, '*')
            
            break 
            }
            case 'ArrowUp': {
            if (!focusedElement || focusedElement.id === 'bookmark-search') {
                break 
            }
            
            const idx = Number(focusedElement.dataset.idx)
            // In first element 
            if (idx < 4) {
                break
            }

            const newIdx = idx - 4
            const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
            if (newElementToFocus) {
                focusedElement = toggleFocusedElement(newElementToFocus, focusedElement)
            }

            break
        }
        case 'ArrowDown': {
            console.log("Focused element.id: ", focusedElement.id)
            if (e.ctrlKey && focusedElement.id == 'bookmark-search') {
                e.preventDefault()
                const newElementToFocus = document.getElementById(`bookmark-0`)
                console.log("new element to focus: ", newElementToFocus)
                if (newElementToFocus) {
                    focusedElement = toggleFocusedElement(newElementToFocus, focusedElement)
                }
                break 
            }

            console.log("Nothing")

            const idx = Number(focusedElement.dataset.idx)
            const gridCount = Number(Math.ceil(globalState.bookmarks.total / 4))
            
            let missingElements = 0
            if ((globalState.bookmarks.total / 4) < gridCount) {
                missingElements = globalState.bookmarks.total % 4 
            }

            const lastColumn = (globalState.bookmarks.total + missingElements) - 4

            if (idx >= lastColumn) {
                break 
            }

            let newIdx = idx + 4

            if (newIdx >= globalState.bookmarks.total && newIdx < globalState.bookmarks.total + missingElements) {
                newIdx = newIdx - missingElements;
            } 

            const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
            if (newElementToFocus) {
                focusedElement = toggleFocusedElement(newElementToFocus, focusedElement)
            }

            break 
        }
        case 'ArrowLeft': {
            const idx = Number(focusedElement.dataset.idx)
            if (idx < 1) {
                break; 
            }

            const newIdx = idx - 1
            const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
            if (newElementToFocus) {
                focusedElement = toggleFocusedElement(newElementToFocus, focusedElement)
            }

            break
            }
            case 'ArrowRight': {
            const idx = Number(focusedElement.dataset.idx)
            if (idx >= globalState.bookmarks.total - 1) {
                break; 
            }

            const newIdx = idx + 1
            const newElementToFocus = document.getElementById(`bookmark-${newIdx}`)
            if (newElementToFocus) {
                focusedElement = toggleFocusedElement(newElementToFocus, focusedElement)
            }

            break
        }
    }

    globalState.bookmarks.focused = focusedElement
    globalState.focusedElement = focusedElement
}