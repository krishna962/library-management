function returnBook(bookId) {
    alert("Book " + bookId + " returned successfully!");
}
function orderTea() {
    alert("Tea ordered successfully!");
}
function payFee() {
    alert("Fee paid successfully!");
}
function logout() {
    alert("Logging out...");
    window.location.href = "index.html";
}


// for hero section 
const images = ['/images/bg1.jpg', '/images/bg2.jpg', '/images/bg3.jpg'];
let current = 0;
setInterval(() => {
    current = (current + 1) % images.length;
    document.querySelector('.hero-section').style.backgroundImage = `url('${images[current]}')`;
}, 5000);



// for success story section

  // for story
  document.addEventListener('DOMContentLoaded', () => {
    const successStoriesRaw = document.getElementById('successStoriesData').textContent;
    let successStories = [];
    try {
      successStories = JSON.parse(successStoriesRaw);
    } catch (error) {
      console.error('Failed to parse success stories:', error);
    }
  
    if (successStories.length === 0) {
      console.log('No success stories found.');
      return;
    }
  
    let currentIndex = 0;
  
    function updateStory(index) {
      const story = successStories[index];
  
      document.getElementById('studentImage').src = story.photoUrl || '/images/default-student.jpg';
      document.getElementById('studentName').innerText = story.name || 'Unknown Student';
      document.getElementById('studentRank').innerText = story.rank || '-';
      document.getElementById('studentExam').innerText = story.exam || '-';
      document.getElementById('studentYear').innerText = story.year || '-';
      document.getElementById('studentDesc').innerText = story.description || 'No description available.';
    }
  
    updateStory(currentIndex); // Show first story
  
    setInterval(() => {
      currentIndex = (currentIndex + 1) % successStories.length;
      updateStory(currentIndex);
    }, 5000); // every 5 sec
  });