import instagramIcon from '../assets/images/icon-instagram.png';
// import tiktokIcon from '../assets/images/icon-tiktok.png';
// import linkedinIcon from '../assets/images/icon-linkedin.png';
// import emailIcon from '../assets/images/icon-email.png';
// import youtubeIcon from '../assets/images/icon-youtube.png';
// import twitterIcon from '../assets/images/icon-twitter.png';
// import facebookIcon from '../assets/images/icon-facebook.png';

function SocialMedia() {
  return (
    <div className="flex space-x-6">
      <a href="https://www.instagram.com/your_instagram_handle/" target="_blank" rel="noopener noreferrer">
        <img src={instagramIcon} alt="Instagram" className="w-8 h-8" />
      </a>
      {/* <a href="https://www.tiktok.com/@your_tiktok_handle" target="_blank" rel="noopener noreferrer">
        <img src={tiktokIcon} alt="TikTok" className="w-8 h-8" />
      </a>
      <a href="https://www.linkedin.com/in/your_linkedin_handle/" target="_blank" rel="noopener noreferrer">
        <img src={linkedinIcon} alt="LinkedIn" className="w-8 h-8" />
      </a>
      <a href="mailto:your_email@example.com">
        <img src={emailIcon} alt="Email" className="w-8 h-8" />
      </a>
      <a href="https://www.youtube.com/channel/your_youtube_channel" target="_blank" rel="noopener noreferrer">
        <img src={youtubeIcon} alt="YouTube" className="w-8 h-8" />
      </a>
      <a href="https://twitter.com/your_twitter_handle" target="_blank" rel="noopener noreferrer">
        <img src={twitterIcon} alt="Twitter" className="w-8 h-8" />
      </a>
      <a href="https://www.facebook.com/your_facebook_page" target="_blank" rel="noopener noreferrer">
        <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
      </a> */}
    </div>
  );
}

export default SocialMedia;
