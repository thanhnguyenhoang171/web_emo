import {  callFetchType } from "@/config/api";
import { convertSlug } from "@/config/utils";
import { IType } from "@/types/backend";
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from "antd";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import styles from "styles/client.module.scss";

interface IProps {
    showPagination?: boolean;
}

const TypeCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayType, setDisplayType] = useState<IType[] | null>(
        null
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchType();
    }, [current, pageSize, filter, sortQuery]);

    const fetchType = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchType(query);
        if (res && res.data) {
            setDisplayType(res.data.result);
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

    const handleViewDetailType = (item: IType) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/type/${slug}?id=${item._id}`);
        }
    };

    return (
        <div className={`${styles["type-section"]}`}>
            <div className={styles["type-content"]}>
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
                                        fontFamily: "Roboto",
                                    }}
                                >
                                    Các loại sản phẩm
                                </span>
                                {!showPagination && (
                                    <Link to="type">Xem tất cả</Link>
                                )}
                            </div>
                        </Col>

                        {displayType?.map((item) => {
                            return (
                                <Col span={24} md={6} key={item._id}>
                                    <Card
                                        onClick={() =>
                                            handleViewDetailType(item)
                                        }
                                        style={{ height: 350 }}
                                        hoverable
                                        cover={
                                            <div
                                                className={
                                                    styles["card-customize"]
                                                }
                                            >
                                                <img
                                                    alt="Logo"
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_BACKEND_URL
                                                    }/images/type/${
                                                        item?.logo
                                                    }`}
                                                />
                                            </div>
                                        }
                                    >
                                        <Divider />
                                        <h3 style={{ textAlign: "center" }}>
                                            {item.name}
                                        </h3>
                                    </Card>
                                </Col>
                            );
                        })}

                        {(!displayType ||
                            (displayType && displayType.length === 0)) &&
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

export default TypeCard;
