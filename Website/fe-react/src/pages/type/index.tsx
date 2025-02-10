import { Col, Row } from 'antd';
import styles from 'styles/client.module.scss';
import TypeCard from '@/components/client/card/type.card';

const ClientTypePage = (props: any) => {
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <TypeCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientTypePage;