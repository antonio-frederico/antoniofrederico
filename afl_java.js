document.addEventListener("DOMContentLoaded", function () {
 
    // Updated loading functionality
    let loadedImages = 0;
    const totalImages = document.images.length;
    const loaderText = document.getElementById('loader-text');
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    function imageLoaded() {
        loadedImages++;
        const percentLoaded = Math.round((loadedImages / totalImages) * 100);
        loaderText.textContent = `loading: ${percentLoaded}%`;

        // Show content when 85% of images are loaded
        if (percentLoaded >= 85) {
            showContent();
        }
    }

    function showContent() {
        loader.style.display = 'none';
        content.style.display = 'block';
        // Initialize the rest of the page functionality
        initializePage();
    }

    if (totalImages === 0) {
        showContent();
    } else {
        for (let i = 0; i < totalImages; i++) {
            const img = new Image();
            img.onload = imageLoaded;
            img.onerror = imageLoaded; // Count errors as loaded to avoid stalling
            img.src = document.images[i].src;
        }

        // Fallback: If loading takes too long, show content anyway
        setTimeout(showContent, 13500); // 10 seconds timeout
    }
 
  // Function to shuffle array elements
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const projectList = document.getElementById("projectList");
  const projects = Array.from(document.querySelectorAll(".project"));

  if (projectList) {
    // Shuffle projects array
    const shuffledProjects = shuffle(projects);

    // Clear existing content of projectList
    projectList.innerHTML = "";

    // Append shuffled projects to projectList and main content
    shuffledProjects.forEach((project) => {
      const projectId = project.getAttribute("id");
      const projectTitle = project.querySelector("h2").textContent;
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.setAttribute("href", `#${projectId}`);
      link.textContent = projectTitle;
      listItem.appendChild(link);
      projectList.appendChild(listItem);

      // Append project to main content
      document.querySelector(".main-content").appendChild(project);
    });
  }

  // Function to ensure the page loads at the top position
  function resetScrollPosition() {
    window.scrollTo(0, 0);
  }

  // Call resetScrollPosition when the page is fully loaded
  window.onload = resetScrollPosition;

  // Call resetScrollPosition after a slight delay to ensure it applies
  setTimeout(resetScrollPosition, 100);

  // Intersection Observer for highlighting visible section
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // Trigger when 50% of the section is visible
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      const link = projectList.querySelector(`a[href="#${entry.target.id}"]`);
      if (entry.isIntersecting) {
        document.querySelectorAll('#projectList a').forEach(a => a.classList.remove('active'));
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  projects.forEach((project) => observer.observe(project));

  // Add toggle functionality for the CV section
  const cvTitle = document.getElementById("cv-title");
  const cvContent = document.getElementById("cv-content");

  if (cvTitle && cvContent) {
    cvTitle.addEventListener("click", function () {
      cvContent.classList.toggle("hidden");
    });
  }

  // Modified toggle functionality for project details
  document.querySelectorAll('.toggle-content').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default button behavior
      const projectDetails = button.nextElementSibling;
      const project = button.closest('.project');
      const projectId = project.id;
      const link = projectList.querySelector(`a[href="#${projectId}"]`);

      // Store the current scroll position
      const scrollPosition = window.pageYOffset;

      projectDetails.classList.toggle('visible');
      projectDetails.classList.toggle('hidden');
      button.classList.toggle('active');

      // Update active link in the project list
      if (projectDetails.classList.contains('visible')) {
        document.querySelectorAll('#projectList a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      } else {
        // If the project is collapsed, trigger the Intersection Observer to update the highlight
        observer.unobserve(project);
        observer.observe(project);
      }

      // Restore the scroll position
      window.scrollTo(0, scrollPosition);
    });
  });

  // Attach smooth scrolling to links
  projectList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Function to update active link based on scroll position
  function updateActiveLink() {
    const scrollPosition = window.scrollY;
    let activeProject = null;

    // Find the project that is currently in view
    projects.forEach(project => {
      const rect = project.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        activeProject = project;
      }
    });

    // Update the active link
    if (activeProject) {
      const activeLink = projectList.querySelector(`a[href="#${activeProject.id}"]`);
      document.querySelectorAll('#projectList a').forEach(a => a.classList.remove('active'));
      activeLink.classList.add('active');
    }
  }

  // Add scroll event listener to update active link
  window.addEventListener('scroll', updateActiveLink);

  // Setup alt text for images
  document.querySelectorAll('.image-container').forEach(container => {
    const img = container.querySelector('img');
    const altText = container.querySelector('.alt-text');
    if (img && altText) {
      altText.textContent = img.getAttribute('alt');
    }
  });

  // Image gallery functionality
  const galleries = document.querySelectorAll('.gallery-container');

  galleries.forEach(gallery => {
    let slideIndex = 0;
    const slides = gallery.querySelectorAll('.gallery-slide img');
    const totalSlides = slides.length;
    let intervalId;

    const showSlide = (index) => {
      clearInterval(intervalId);
      slideIndex = (index + totalSlides) % totalSlides;
      slides.forEach((slide, i) => {
        if (i === slideIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      startGallery();
    };

    const startGallery = () => {
      intervalId = setInterval(() => {
        showSlide(slideIndex + 1);
      }, 4000);
    };

    // Create and append arrow buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'prev';
    prevButton.innerHTML = '❮';
    gallery.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.className = 'next';
    nextButton.innerHTML = '❯';
    gallery.appendChild(nextButton);

    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(slideIndex - 1);
    });

    nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(slideIndex + 1);
    });

    // Set initial active slide
    showSlide(slideIndex);

    // Add click event to enlarge images
    slides.forEach((slide, index) => {
      slide.addEventListener('click', (e) => {
        e.stopPropagation();
        enlargeGallery(gallery, index);
      });
    });
  });

  // Function to create and show enlarged gallery
  function enlargeGallery(gallery, startIndex) {
    const slides = gallery.querySelectorAll('.gallery-slide img');
    const totalSlides = slides.length;
    let currentIndex = startIndex;

    const overlay = document.createElement('div');
    overlay.className = 'enlarged-image-overlay';
    
    const container = document.createElement('div');
    container.className = 'enlarged-image-container';
    
    const img = document.createElement('img');
    img.src = slides[currentIndex].src;
    img.className = 'enlarged-image';
    
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'close-button';

    const prevButton = document.createElement('button');
    prevButton.className = 'enlarged-prev';
    prevButton.innerHTML = '❮';

    const nextButton = document.createElement('button');
    nextButton.className = 'enlarged-next';
    nextButton.innerHTML = '❯';
    
    container.appendChild(img);
    container.appendChild(prevButton);
    container.appendChild(nextButton);
    overlay.appendChild(container);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
    
    // Show the overlay
    overlay.style.display = 'flex';
    
    // Disable scrolling on the main page
    document.body.style.overflow = 'hidden';
    
    const showEnlargedSlide = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      img.src = slides[currentIndex].src;
    };

    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      showEnlargedSlide(currentIndex - 1);
    });

    nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      showEnlargedSlide(currentIndex + 1);
    });

    // Close on click outside the image or on close button
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeButton) {
        document.body.removeChild(overlay);
        // Re-enable scrolling on the main page
        document.body.style.overflow = 'auto';
      }
    });

    // Prevent closing when clicking inside the image container
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
});