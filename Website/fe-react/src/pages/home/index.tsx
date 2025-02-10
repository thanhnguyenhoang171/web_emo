import { Divider } from "antd";
import styles from "styles/client.module.scss";
import SearchClient from "@/components/client/search.client";
import ProductCard from "@/components/client/card/product.card";
import TypeCard from "@/components/client/card/type.card";

const HomePage = () => {
    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            {/* <div className="search-content" style={{ marginTop: 20 }}>
                <SearchClient />
            </div> */}
            <Divider />
            <TypeCard />
            <div style={{ margin: 50 }}></div>
            <Divider />
            <ProductCard />
        </div>
    );
};

export default HomePage;
