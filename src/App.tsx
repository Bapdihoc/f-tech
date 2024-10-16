import 'dayjs/locale/zh-cn';

import { Flex, Spin } from 'antd';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { history, HistoryRouter } from '@/routes/history';

import RenderRouter from './routes';
import MainLayout from './layout/main-layout';

const App: React.FC = () => {
    const { loading } = useSelector(state => state.global);
    return (
        <HistoryRouter history={history}>
            <Suspense
                fallback={
                    <MainLayout>
                        <Flex justify="center">
                            <Spin size="large" />
                        </Flex>
                    </MainLayout>
                }
            >
                <RenderRouter />
            </Suspense>
        </HistoryRouter>
    );
};

export default App;
