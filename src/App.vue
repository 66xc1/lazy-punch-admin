<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
    $primary: #409EFF;
    $success: #67C23A;
    $info: #909399;
    $warning: #E6A23C;
    $danger: #F56C6C;
    * {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .toolBar {
        background: #fff;
        padding: 10px;
    }

    .invertToolBar {
        background: #f2f2f2;
        padding: 10px;
    }

    .fontSize16 {
        font-size: 16px;
    }

    .text-ellipsis{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .m10 {
        margin: 10px !important;
    }

    .mTop10 {
        margin-top: 10px !important;
    }

    .mTop20 {
        margin-top: 20px !important;
    }

    .mBottom10 {
        margin-bottom: 10px !important;
    }

    .mBottom16 {
        margin-bottom: 16px !important;
    }

    .mRight10 {
        margin-right: 10px !important;
    }

    .center {
        display: block;
        margin: 0 auto;
        text-align: center;
    }

    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    .maxWidth {
        width: 100%;
    }

    .w100 {
        width: 100%;
    }

    .hkDanger {
        color: $danger;
    }

    .hkDanger:hover {
        color: $danger;
    }

    .el-card, .el-message {
        border-radius: 0;
    }

    .block {
        display: block;
        padding: 10px 0;
        font-size: 14px;
    }

    .block_np {
        display: block;
        padding: 10px 0;
        font-size: 14px;
    }

    .maxHeight {
        max-height: calc(100vh - 160px);
        overflow-y: scroll;
    }

    .maxHeight::-webkit-scrollbar {
        display: none
    }

    .form-mask {
        position: absolute;
        background: #000000;
        opacity: 0.02;
        left: -20px;
        right: -20px;
        top: -20px;
        bottom: -20px;
        z-index: 88;
    }

    body .el-table th.gutter {
        display: table-cell !important;
    }

    .tab-main-container{
        padding: 20px;
        border: 1px solid #EFEFEF;
        border-top: none;
    }

    .border-box{
        border: 1px solid #EFEFEF;
        padding: 20px;
    }
</style>
