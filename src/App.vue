<template>
	<router-link :to="{ name: 'Home' }">首页</router-link> &nbsp; | &nbsp;
	<router-link :to="{ name: 'Login' }">登录</router-link> &nbsp; | &nbsp;
	<router-view></router-view>
</template>

<script setup lang="ts"></script>

<style></style>
