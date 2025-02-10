import { Button, Col, Form, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IRating } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callFetchRatingByUser, callGetSubscriberSkills, callUpdateSubscriber } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserRating = (props: any) => {
    const [listCV, setListCV] = useState<IRating[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchRatingByUser();
            if (res && res.data) {
                setListCV(res.data as IRating[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IRating> = [
        {
            title: "STT",
            key: "index",
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return <>{index + 1}</>;
            },
        },
        {
            title: "Loại sản phẩm",
            dataIndex: ["typeId", "name"],
        },
        {
            title: "Tên Sản phẩm",
            dataIndex: ["productId", "name"],
        },
        {
            title: "Comment",
            dataIndex: "comment",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
        },
        {
            title: "Ngày đánh giá",
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>
                );
            },
        },
        {
            title: "Ảnh feedback",
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        style={{
                            textAlign: "center", 
                            display: "block", 
                        }}
                        href={`${
                            import.meta.env.VITE_BACKEND_URL
                        }/images/rating/${record?.url}`}
                        target="_blank"
                    >
                        Chi tiết
                    </a>
                );
            },
        },
        // {
        //     title: "Ảnh feedback AI",
        //     dataIndex: "",
        //     render(value, record, index) {
        //         return (
        //             <a
        //                 style={{
        //                     textAlign: "center", // Căn giữa chữ
        //                     display: "block", // Đảm bảo thẻ <a> chiếm toàn bộ chiều rộng
        //                 }}
        //                 href={`${
        //                     import.meta.env.VITE_BACKEND_URL
        //                 }/images/detectedEmotion/${record?.url}`}
        //                 target="_blank"
        //             >
        //                 Chi tiết
        //             </a>
        //         );
        //     },
        // },
    ];

    return (
        <div>
            <Table<IRating>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    return (
        <div>
            //todo
        </div>
    )
}


const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-rating',
            label: `Những bài đã đánh giá`,
            children: <UserRating />,
        },
        // {
        //     key: 'email-by-skills',
        //     label: `Nhận thông báo qua Email`,
        //     children: <ProductByEmail />,
        // },
        // {
        //     key: 'user-update-info',
        //     label: `Cập nhật thông tin`,
        //     children: <UserUpdateInfo />,
        // },
        // {
        //     key: 'user-password',
        //     label: `Thay đổi mật khẩu`,
        //     children: `//todo`,
        // },
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-rating"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;