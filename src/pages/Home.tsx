import React from "react";

function Home() {
    return (
        <div className="d-flex justify-content-center align-items-center bg-light-subtle" style={{ minHeight: "40em" }}>
            <div className="container text-center p-4 my-5">
                <h1>Fake Store</h1>

                <p className="mt-3 mx-auto" style={{ maxWidth: "50%" }}>
                    Welcome to Fake Store — your place to find quality products at great prices.
                    Browse our items and discover something new.
                </p>
            </div>
        </div>
    );
}

export default Home;



