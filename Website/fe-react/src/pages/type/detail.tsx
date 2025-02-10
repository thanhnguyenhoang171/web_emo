import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { IType } from "@/types/backend";
import { callFetchTypeById } from "@/config/api";
import styles from "styles/client.module.scss";
import parse from "html-react-parser";
import { Col, Divider, Row, Skeleton } from "antd";

const ClientTypeDetailPage = () => {
    const [typeDetail, setTypeDetail] = useState<IType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // product id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true);
                const res = await callFetchTypeById(id);
                if (res?.data) {
                    setTypeDetail(res.data);
                }
                setIsLoading(false);
            }
        };
        init();
    }, [id]);
    console.log(typeDetail?.description);


    return (
        <div
            className={`${styles["container"]} ${styles["detail-product-section"]}`}
        >
            {isLoading ? (
                <Skeleton active />
            ) : (
                <Row gutter={[20, 20]}>
                    {typeDetail && typeDetail._id && (
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {typeDetail.name}
                                </div>
                                <Divider />
                                {/* Parse HTML description */}
                                <div className={styles["description"]}>
                                    {parse(typeDetail?.description ?? "")}
                                </div>
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles["type"]}>
                                    <div>
                                        <img
                                            alt="Logo"
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/images/type/${typeDetail?.logo}`}
                                        />
                                    </div>
                                    <div>{typeDetail?.name}</div>
                                </div>
                            </Col>
                        </>
                    )}
                </Row>
            )}
        </div>
    );
};

export default ClientTypeDetailPage;
