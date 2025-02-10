import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IProduct } from "@/types/backend";
import { callFetchProductById } from "@/config/api";
import styles from "styles/client.module.scss";
import parse from "html-react-parser";
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import {
    DollarOutlined,
    EnvironmentOutlined,
    HistoryOutlined,
} from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import tiếng Việt

dayjs.extend(relativeTime);
dayjs.locale("vi"); // Đặt locale về tiếng Việt

import ApplyModal from "@/components/client/modal/apply.modal";

const ClientProductDetailPage = (props: any) => {
    const [productDetail, setProductDetail] = useState<IProduct | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // product id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true);
                const res = await callFetchProductById(id);
                if (res?.data) {
                    setProductDetail(res.data);
                }
                setIsLoading(false);
            }
        };
        init();
    }, [id]);

    return (
        <div
            className={`${styles["container"]} ${styles["detail-product-section"]}`}
        >
            {isLoading ? (
                <Skeleton />
            ) : (
                <Row gutter={[20, 20]}>
                    {productDetail && productDetail._id && (
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {productDetail.name}
                                </div>
                                <div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles["btn-apply"]}
                                    >
                                        Đánh giá ngay
                                    </button>
                                </div>
                                <Divider />

                                <div className={styles["price"]}>
                                    <DollarOutlined />
                                    <span> Giá tiền:
                                        &nbsp;
                                        {(productDetail.price + "")?.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )}{" "}
                                        đ
                                    </span>
                                </div>

                                <div>
                                    <HistoryOutlined />{" "}
                                    {dayjs(productDetail.updatedAt)
                                        .locale("vi")
                                        .fromNow()}
                                </div>

                                <Divider />
                                {parse(productDetail.description)}
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles["type"]}>
                                    <div>
                                        <img
                                            alt="Logo"
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/images/product/${
                                                productDetail.image
                                            }`}
                                        />
                                    </div>
                                    <div>{productDetail.type?.name}</div>
                                </div>
                            </Col>
                        </>
                    )}
                </Row>
            )}
            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                productDetail={productDetail}
                setDataInit={() => {}}
                reloadTable={() => {}} // Truyền các props này
            />
        </div>
    );
};
export default ClientProductDetailPage;
