import { callFetchProduct } from "@/config/api";
import { LOCATION_LIST, convertSlug, getLocationName } from "@/config/utils";
import { IProduct } from "@/types/backend";
import { DollarOutlined, EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Pagination, Row, Spin } from "antd";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import styles from "styles/client.module.scss";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Import tiếng Việt

dayjs.extend(relativeTime);
dayjs.locale('vi'); // Đặt locale về tiếng Việt

interface IProps {
    showPagination?: boolean;
}

const ProductCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayProduct, setDisplayProduct] = useState<IProduct[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [current, pageSize, filter, sortQuery]);

    const fetchProduct = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchProduct(query);
        if (res && res.data) {
            setDisplayProduct(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleOnchangePage = (pagination: {
        current: number;
        pageSize: number;
    }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleViewDetailProduct= (item: IProduct) => {
        const slug = convertSlug(item.name);
        navigate(`/product/${slug}?id=${item._id}`);
    };

    return (
        <div className={`${styles["card-product-section"]}`}>
            <div className={`${styles["product-content"]}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div
                                className={
                                    isMobile
                                        ? styles["dflex-mobile"]
                                        : styles["dflex-pc"]
                                }
                            >
                                <span
                                    style={{
                                        fontSize: "27px",
                                        fontFamily:"Roboto",
                                      
                                    }}
                                >
                                    Các loại thức uống
                                </span>

                                {!showPagination && (
                                    <Link to="product">Xem tất cả</Link>
                                )}
                            </div>
                        </Col>

                        {displayProduct?.map((item) => {
                            return (
                                <Col span={24} md={12} key={item._id}>
                                    <Card
                                        size="small"
                                        title={null}
                                        hoverable
                                        onClick={() =>
                                            handleViewDetailProduct(item)
                                        }
                                    >
                                        <div
                                            className={
                                                styles["card-product-content"]
                                            }
                                        >
                                            <div
                                                className={
                                                    styles["card-product-left"]
                                                }
                                            >
                                                <img
                                                    alt="example"
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_BACKEND_URL
                                                    }/images/product/${
                                                        item?.image
                                                    }`}
                                                />
                                            </div>
                                            <div
                                                className={
                                                    styles["card-product-right"]
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles["product-title"]
                                                    }
                                                >
                                                    {item.name}
                                                </div>

                                                <div>
                                                    <DollarOutlined
                                                        style={{
                                                            color: "orange",
                                                        }}
                                                    />
                                                    &nbsp; Giá: &nbsp;
                                                    {(item.price + "")?.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ","
                                                    )}{" "}
                                                    đ
                                                </div>
                                                <div
                                                    className={
                                                        styles[
                                                            "product-updatedAt"
                                                        ]
                                                    }
                                                >
                                                    Ngày ra mắt: &nbsp;
                                                    {dayjs(item.updatedAt)
                                                        .locale("vi")
                                                        .fromNow()}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}

                        {(!displayProduct ||
                            (displayProduct && displayProduct.length === 0)) &&
                            !isLoading && (
                                <div className={styles["empty"]}>
                                    <Empty description="Không có dữ liệu" />
                                </div>
                            )}
                    </Row>
                    {showPagination && (
                        <>
                            <div style={{ marginTop: 30 }}></div>
                            <Row
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p: number, s: number) =>
                                        handleOnchangePage({
                                            current: p,
                                            pageSize: s,
                                        })
                                    }
                                />
                            </Row>
                        </>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default ProductCard;
