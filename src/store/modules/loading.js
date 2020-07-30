const loading = {
    state: {
        loading: 0,
    },
    getters: {
        loading: state => state.loading,
    },
    mutations: {
        changeLoading: (state, num) => {
            state.loading = state.loading + num;
        },
    }
};

export default loading;
