import React from "react";
import Header from "./Header";
import CardPizza from "./CardPizza";
function Home() {
  return (
    <div>
      <Header />
      <div className="container my-5">
        <div className="row ">
          <div className="col-md-4">
            <CardPizza
              name="Napolitana"
              price="5.950"
              ingridients={["mozzarella", "tomates", "jamón", "orégano"]}
              imagen={
                "https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.com/o/pizzeria%2Fpizza-1239077_640_cl.jpg?alt=media&token=6a9a33da-5c00-49d4-9080-784dcc87ec2c"
              }
            />
          </div>
          <div className="col-md-4">
            <CardPizza
              name="Española"
              price="6.950"
              ingridients={[
                "mozzarella",
                "gorgonzola",
                "parmesano",
                "provolone",
              ]}
              imagen={
                "https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.com/o/pizzeria%2Fcheese-164872_640_com.jpg?alt=media&token=18b2b821-4d0d-43f2-a1c6-8c57bc388fab"
              }
            />
          </div>

          <div className="col-md-4">
            <CardPizza
              name="Pepperoni"
              price="6.950"
              ingridients={["mozzarella", "pepperoni", "orégano"]}
              imagen={
                "https://www.hola.com/horizon/landscape/e9e1e82cb873-pepperoni-pizza-abob-t.jpg"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
