import type { Bookmark } from "./bookmarks"

type GlobalState = {
    focusedSection: HTMLElement | null,
    focusedElement: HTMLElement | null,
    allSections: string[],
    bookmarks: {
        sectionContainer: HTMLElement
        total: number, 
        all: Bookmark[],
        focused: HTMLElement | null, 
    },
    search: {
        sectionId: string,
        inputElement: HTMLInputElement
    }
}

const globalState: GlobalState = {
    focusedSection: null,
    focusedElement: null,
    allSections: [
        'info-container',
        'bookmark-search',
        'bookmark-list'
    ],
    bookmarks: {
        sectionContainer: document.getElementById('bookmark-list') as HTMLElement,
        total: 0,
        all: [], 
        focused: null
    },
    search: {
        sectionId: 'bookmark-search',
        inputElement: document.getElementById('bookmark-search') as HTMLInputElement,
    }
}

export default globalState