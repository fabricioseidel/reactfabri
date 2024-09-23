function Header() {
  return (
    <div>
      <header
        className="d-flex align-items-center justify-content-center text-black"
        style={{
          height: "50vh",
          background:
            "rgba(0, 0, 0, 0.5) url(https://cdn.pixabay.com/photo/2014/05/18/11/25/pizza-346985_1280.jpg) center/cover",
        }}
      >
        <div className="text-center ">
          <h1 className="display-1">¡Michi Pizzeria!</h1>
          <p style={{ fontSize: "2rem" }}>¡las mejores michipizzas!</p>
        </div>
      </header>
    </div>
  );
}

export default Header;
