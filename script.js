// script.js
// RandomFox Wildlife Gallery
// Author: Student
// This file contains all logic for fetching fox images, handling UI, and managing favorites.

import { BASE_URL } from './config.js';

// DOM Elements
const gallery = document.getElementById('gallery');
const favoritesGallery = document.getElementById('favorites-gallery');
const errorContainer = document.getElementById('error-container');
const loadingSection = document.getElementById('loading');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const loadMoreBtn = document.getElementById('load-more-btn');
const themeToggleBtn = document.getElementById('toggle-theme');

// Update theme icon based on mode (SVG for better control)
function updateThemeIcon() {
    const iconSpan = document.getElementById('theme-icon');
    if (!iconSpan) return;
    if (document.body.classList.contains('dark')) {
        // Sun icon (yellow)
        iconSpan.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="8" fill="#FFD600"/>
            <g stroke="#FFD600" stroke-width="2">
                <line x1="16" y1="2" x2="16" y2="7"/>
                <line x1="16" y1="25" x2="16" y2="30"/>
                <line x1="2" y1="16" x2="7" y2="16"/>
                <line x1="25" y1="16" x2="30" y2="16"/>
                <line x1="6.22" y1="6.22" x2="9.54" y2="9.54"/>
                <line x1="22.46" y1="22.46" x2="25.78" y2="25.78"/>
                <line x1="6.22" y1="25.78" x2="9.54" y2="22.46"/>
                <line x1="22.46" y1="9.54" x2="25.78" y2="6.22"/>
            </g>
        </svg>`;
    } else {
        // Moon icon (always black)
        iconSpan.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26 22.5C23.5 23.5 20.5 23.5 18 22.5C13.5 20.5 10.5 15.5 12.5 11C13.5 8.5 15.5 6.5 18 5.5C18.5 5.3 18.5 4.5 18 4.3C17.5 4.1 16.5 4 16 4C9.5 4 4 9.5 4 16C4 22.5 9.5 28 16 28C19 28 21.7 26.8 23.7 24.9C24.1 24.5 23.9 23.8 23.4 23.7C23.1 23.6 22.7 23.6 22.5 23.7Z" fill="#111"/>
        </svg>`;
    }
}

// State
let foxImages = [];
let favorites = JSON.parse(localStorage.getItem('foxFavorites') || '[]');
let foxTags = JSON.parse(localStorage.getItem('foxTags') || '{}'); // { imageUrl: ["cute", "wild"] }
let isLoading = false;
let lastSearch = '';

// Utility Functions
function setLoading(loading) {
    isLoading = loading;
    loadingSection.classList.toggle('hidden', !loading);
    searchBtn.disabled = loading;
    loadMoreBtn.disabled = loading;
}

function showError(message) {
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
}

function clearError() {
    errorContainer.textContent = '';
    errorContainer.classList.add('hidden');
}

function trimInput(input) {
    return input.trim();
}

// API Functions
/**
 * Fetches a random fox image from the API.
 * @returns {Promise<Object>} Fox image object { image, link }
 */
async function fetchRandomFox() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch fox image.');
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches multiple random fox images.
 * @param {number} count Number of images to fetch
 * @returns {Promise<Array>} Array of fox image objects
 */
async function fetchMultipleFoxes(count = 6) {
    const promises = Array.from({ length: count }, fetchRandomFox);
    return Promise.all(promises);
}

// DOM Functions
/**
 * Renders fox images in the gallery.
 * @param {Array} images Array of fox image objects
 * @param {HTMLElement} container Gallery container element
 * @param {boolean} isFavoriteGallery Is this the favorites gallery?
 */
function renderGallery(images, container, isFavoriteGallery = false) {
    container.innerHTML = '';
    if (!images.length) {
        container.innerHTML = '<p>No foxes found.</p>';
        return;
    }
    images.forEach(img => {
        const card = document.createElement('div');
        card.className = 'card';
        // Get tags for this image
        const tags = foxTags[img.image] || [];
        card.innerHTML = `
            <img src="${img.image}" alt="Fox" loading="lazy" class="gallery-img" style="cursor:pointer;">
            <div class="card-actions">
                <a href="${img.link}" target="_blank" rel="noopener" title="View Source">🔗</a>
                <button class="favorite-btn${isFavorited(img) ? ' favorited' : ''}" aria-label="Favorite">❤</button>
            </div>
            <div class="tag-section">
                <div class="tags-list">${tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</div>
                <input type="text" class="tag-input" placeholder="Add tag..." aria-label="Add tag">
                <button class="add-tag-btn">Add</button>
            </div>
        `;
        const favBtn = card.querySelector('.favorite-btn');
        favBtn.addEventListener('click', () => toggleFavorite(img));
        // Tag adding logic
        const tagInput = card.querySelector('.tag-input');
        const addTagBtn = card.querySelector('.add-tag-btn');
        addTagBtn.addEventListener('click', () => handleAddTag(img, tagInput, card));
        tagInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') handleAddTag(img, tagInput, card);
        });
        // Image click for modal
        const galleryImg = card.querySelector('.gallery-img');
        if (galleryImg) {
            galleryImg.addEventListener('click', () => openImageModal(img.image));
        }
        container.appendChild(card);
    });
// Modal logic
document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    // Modal setup
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');
    if (imageModal && modalClose && modalImg) {
        function closeModal() {
            imageModal.classList.add('hidden');
            modalImg.src = '';
        }
        modalClose.addEventListener('click', closeModal);
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (!imageModal.classList.contains('hidden') && (e.key === 'Escape' || e.key === 'Esc')) {
                closeModal();
            }
        });
    }
});

function openImageModal(src) {
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    if (imageModal && modalImg) {
        modalImg.src = src;
        imageModal.classList.remove('hidden');
    }
}
}
// Add tag to image
function handleAddTag(img, tagInput, card) {
    const tag = tagInput.value.trim();
    if (!tag) return;
    const imageUrl = img.image;
    if (!foxTags[imageUrl]) foxTags[imageUrl] = [];
    if (!foxTags[imageUrl].includes(tag)) {
        foxTags[imageUrl].push(tag);
        localStorage.setItem('foxTags', JSON.stringify(foxTags));
        // Update tags list in card
        const tagsList = card.querySelector('.tags-list');
        tagsList.innerHTML = foxTags[imageUrl].map(t => `<span class="tag">${t}</span>`).join(' ');
    }
    tagInput.value = '';
}

/**
 * Checks if a fox image is in favorites.
 * @param {Object} img Fox image object
 * @returns {boolean}
 */
function isFavorited(img) {
    return favorites.some(fav => fav.image === img.image);
}

/**
 * Adds or removes a fox image from favorites.
 * @param {Object} img Fox image object
 */
function toggleFavorite(img) {
    if (isFavorited(img)) {
        favorites = favorites.filter(fav => fav.image !== img.image);
    } else {
        favorites.push(img);
    }
    localStorage.setItem('foxFavorites', JSON.stringify(favorites));
    renderGallery(foxImages, gallery);
    renderGallery(favorites, favoritesGallery, true);
}

// Search & Filter Functions
function handleSearch() {
    clearError();
    const query = trimInput(searchBar.value).toLowerCase();
    if (!query) {
        showError('Please enter a tag or keyword.');
        return;
    }
    lastSearch = query;
    // Find all images with this tag in foxTags
    const allTaggedImages = Object.entries(foxTags)
        .filter(([url, tags]) => tags.map(t => t.toLowerCase()).some(tag => tag.includes(query)))
        .map(([url]) => url);
    // Merge with loaded foxImages and favorites to get their data
    const allImages = [...foxImages, ...favorites]
        .filter((img, idx, arr) => allTaggedImages.includes(img.image) && arr.findIndex(i => i.image === img.image) === idx);
    // If any tagged images are not in foxImages or favorites, create minimal objects
    allTaggedImages.forEach(url => {
        if (!allImages.some(img => img.image === url)) {
            allImages.push({ image: url, link: url });
        }
    });
    if (!allImages.length) {
        showError('No foxes found for that tag.');
    }
    renderGallery(allImages, gallery);
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchBar.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
});
loadMoreBtn.addEventListener('click', loadFoxes);
themeToggleBtn.addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
    loadFoxes();
    renderGallery(favorites, favoritesGallery, true);
    // Theme persistence
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    updateThemeIcon();

    // Modal setup
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');
    if (imageModal && modalClose && modalImg) {
        function closeModal() {
            imageModal.classList.add('hidden');
            modalImg.src = '';
        }
        modalClose.addEventListener('click', closeModal);
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (!imageModal.classList.contains('hidden') && (e.key === 'Escape' || e.key === 'Esc')) {
                closeModal();
            }
        });
    }
});

// Main Loader
async function loadFoxes() {
    setLoading(true);
    clearError();
    try {
        const foxes = await fetchMultipleFoxes();
        foxImages = foxes;
        renderGallery(foxImages, gallery);
    } catch (error) {
        showError('Failed to load fox images. Please try again.');
    } finally {
        setLoading(false);
    }
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    updateThemeIcon();
}
