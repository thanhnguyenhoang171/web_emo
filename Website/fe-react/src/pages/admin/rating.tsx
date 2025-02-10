import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IRating } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
    ActionType,
    ProColumns,
    ProFormSelect,
} from "@ant-design/pro-components";
import {
    Button,
    Popconfirm,
    Select,
    Space,
    Tag,
    message,
    notification,
} from "antd";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import { callDeleteRating } from "@/config/api";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { fetchRating } from "@/redux/slice/ratingSlide";
import ViewDetailRating from "@/components/admin/rating/view.rating";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";

const RatingPage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector((state) => state.rating.isFetching);
    const meta = useAppSelector((state) => state.rating.meta);
    const ratings = useAppSelector((state) => state.rating.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IRating | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const getColorByEmotion = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case "happy":
                return "green";
            case "sad":
                return "blue";
            case "neutral":
                return "gray";
            case "angry":
                return "red";
            case "disgust":
                return "purple";
            case "fear":
                return "black";
            case "surprise":
                return "orange";
            default:
                return "gold";
        }
    };

    const handleDeleteRating = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteRating(_id);
            if (res && res.data) {
                message.success("Xóa Đánh giá thành công");
                reloadTable();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                });
            }
        }
    };

    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    const columns: ProColumns<IRating>[] = [
        {
            title: "ID",
            dataIndex: "_id",
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(record);
                        }}
                    >
                        {record._id}
                    </a>
                );
            },
            hideInSearch: true,
        },

        {
            title: "Loại sản phẩm",
            dataIndex: ["typeId", "name"],
            hideInSearch: true,
        },
        {
            title: "Sản phẩm",
            dataIndex: ["productId", "name"],
            hideInSearch: true,
        },
        {
            title: "Comment",
            dataIndex: "comment",
            hideInSearch: true,
        },
        {
            title: "KQ phân tích ảnh Feedback",
            dataIndex: "detectedEmotion",
            hideInSearch: true,
            render: (detectedEmotion) => {
                if (
                    !Array.isArray(detectedEmotion) ||
                    detectedEmotion.length === 0
                ) {
                    return "-";
                }

                return detectedEmotion.map((emotion: any, index: number) => (
                    <Tag
                        style={{
                            textAlign: "center",
                            display: "block",
                            margin: 2,
                        }}
                        key={index}
                        color={getColorByEmotion(emotion.class)}
                    >
                        {emotion.class} (
                        {(emotion.confidenceScore * 100).toFixed(2)}
                        %)
                    </Tag>
                ));
            },
        },

        {
            title: "Ảnh feedback AI",
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        style={{
                            textAlign: "center", // Căn giữa chữ
                            display: "block", // Đảm bảo thẻ <a> chiếm toàn bộ chiều rộng
                        }}
                        href={`${
                            import.meta.env.VITE_BACKEND_URL
                        }/images/detectedEmotion/${record?.url}`}
                        target="_blank"
                    >
                        Chi tiết
                    </a>
                );
            },
        },
        {
            title: "Đánh giá tốt?",
            dataIndex: "isPositive",
            hideInSearch: true,
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            sorter: true,
            renderFormItem: (item, props, form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        PENDING: "PENDING",
                        REVIEWING: "REVIEWING",
                        APPROVED: "APPROVED",
                        REJECTED: "REJECTED",
                    }}
                    placeholder="Chọn trạng thái"
                />
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            width: 170,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>
                );
            },
            hideInSearch: true,
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            width: 170,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>
                );
            },
            hideInSearch: true,
        },

        // {

        //     title: 'Actions',
        //     hideInSearch: true,
        //     width: 50,
        //     render: (_value, entity, _index, _action) => (
        //         <Space>
        //             <EditOutlined
        //                 style={{
        //                     fontSize: 20,
        //                     color: '#ffa500',
        //                 }}
        //                 type=""
        //                 onClick={() => {
        //                     navigate(`/admin/product/upsert?id=${entity._id}`)
        //                 }}
        //             />

        //             <Popconfirm
        //                 placement="leftTop"
        //                 title={"Xác nhận xóa resume"}
        //                 description={"Bạn có chắc chắn muốn xóa resume này ?"}
        //                 onConfirm={() => handleDeleteResume(entity._id)}
        //                 okText="Xác nhận"
        //                 cancelText="Hủy"
        //             >
        //                 <span style={{ cursor: "pointer", margin: "0 10px" }}>
        //                     <DeleteOutlined
        //                         style={{
        //                             fontSize: 20,
        //                             color: '#ff4d4f',
        //                         }}
        //                     />
        //                 </span>
        //             </Popconfirm>
        //         </Space>
        //     ),

        // },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        if (clone?.status?.length) {
            clone.status = clone.status.join(",");
        }

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.status) {
            sortBy = sort.status === "ascend" ? "sort=status" : "sort=-status";
        }

        if (sort && sort.createdAt) {
            sortBy =
                sort.createdAt === "ascend"
                    ? "sort=createdAt"
                    : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy =
                sort.updatedAt === "ascend"
                    ? "sort=updatedAt"
                    : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        temp +=
            "&populate=typeId,productId&fields=typeId._id, typeId.name, typeId.logo, productId._id, productId.name";
        return temp;
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.RATINGS.GET_PAGINATE}>
                <DataTable<IRating>
                    actionRef={tableRef}
                    headerTitle="Danh sách Đánh giá"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={ratings}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchRating({ query }));
                    }}
                    scroll={{ x: true }}
                    pagination={{
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {" "}
                                    {range[0]}-{range[1]} trên {total} rows
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return <></>;
                    }}
                />
            </Access>
            <ViewDetailRating
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div>
    );
};

export default RatingPage;
