import "../styles/footer.module.css";

function Footer() {
  return (
    <footer className="footer">
      <p>MJ Store © {new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;
