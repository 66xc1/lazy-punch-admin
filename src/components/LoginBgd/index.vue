<template>
  <div class="login-container pull-height">
    <!--<img src="../../../build/logo.png" style='margin-bottom: 500px;' />-->
    <template class='loginGrid'>
      <slot></slot>
    </template>
  </div>
</template>
<script>

export default {
    name: 'LoginBgd',
    data() {
        return {};
    }
};
</script>

<style scoped lang="scss">
  .login-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: rgba(0, 0, 0, 0.2);
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .login-container::before {
    z-index: -999;
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /*background-image: url("../../assets/login.png");*/
    background-size: cover;
  }

  .loginGrid {
    margin-top: 200px;
  }

</style>
