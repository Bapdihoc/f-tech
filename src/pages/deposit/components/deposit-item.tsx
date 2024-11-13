import RewardCard from '@/components/core/reward-card';
import { SecondaryButton } from '@/components/core/secondary-button';
import { useAuthorize } from '@/hooks/use-authorize';
import { OnAction } from '@/types';
import { Pack } from '@/types/pack/pack';
import { EditOutlined } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';
import PlaceholderSvg from '/public/placeholder.svg';

interface DepositItemProps {
    pack: Pack;
    handleOpenUpdate?: OnAction;
    setPackId?: React.Dispatch<React.SetStateAction<string>>;
}

const DepositItem = ({ pack, handleOpenUpdate, setPackId }: DepositItemProps) => {
    const isAllowUpdatePack = useAuthorize();

    return (
        <Flex vertical>
            <RewardCard
                title={
                    <div style={{ position: 'relative' }}>
                        <Typography.Title level={5}>{pack?.point} MC</Typography.Title>

                        {isAllowUpdatePack && (
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined style={{ fontSize: 16 }} />}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }}
                                onClick={() => {
                                    handleOpenUpdate?.();
                                    setPackId?.(pack.monkeyCoinPackId);
                                }}
                            />
                        )}
                    </div>
                }
                hoverable
                style={{ width: 348 }}
                cover={
                    <img
                        alt="example"
                        src={pack?.imgUrl || PlaceholderSvg}
                        style={{ height: 180, objectFit: 'cover' }}
                    />
                }
                className="deposit-item"
            >
                <Flex justify="space-between" align="center">
                    <Typography.Title level={4}>{pack?.price} VND</Typography.Title>

                    <SecondaryButton>Buy</SecondaryButton>
                </Flex>
            </RewardCard>
        </Flex>
    );
};

export default DepositItem;
