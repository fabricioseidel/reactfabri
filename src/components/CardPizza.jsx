import React from "react";

function CardPizza({ name, price, ingridients, imagen }) {
  return (
    <div
      className="card shadow-sm rounded"
      style={{
        borderRadius: "15px",
        border: "1px solid #e0e0e0",
      }}
    >
      <img
        src={imagen}
        className="card-img-top"
        alt={name}
        style={{
          height: "180px",
          marginBottom: "5px",
        }}
      />
      <div className="card-body text-center" style={{ padding: "1px" }}>
        <h5
          className="card-title"
          style={{ fontWeight: "bold", fontSize: "16px" }}
        >
          {name}
        </h5>
        <p
          className="text-muted"
          style={{ fontSize: "16px", marginBottom: "2px" }}
        >
          <strong>Ingredientes:</strong>🍕
        </p>
        <ul
          className="list-unstyled text-muted d-flex justify-content-center"
          style={{
            fontSize: "0.85rem",
            gap: "5px",
            marginBottom: "2px",
            flexWrap: "wrap",
          }}
        >
          {ingridients.map((e, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center" }}>
              {e}
            </li>
          ))}
        </ul>
        <p
          className="card-text text-dark font-weight-bold"
          style={{ fontSize: "16px", marginBottom: "2px" }}
        >
          Precio: ${price.toLocaleString("es")}
        </p>
        <button className="btn btn-primary"> 👀 Ver más</button>
        <button className="btn btn-success"> 🛒 Añadir</button>
      </div>
    </div>
  );
}

export default CardPizza;
