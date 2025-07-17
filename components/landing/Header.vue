<template>
  <header class="header-area">
    <div class="navbar-area">
      <div class="container relative">
        <div class="row">
          <div class="w-full">
            <!-- <nav class="navbar navbar-expand-lg flex items-center justify-between"> -->
            <!-- <a class="navbar-brand mr-4" href="index.html">
                <img :src="pathto('/landing/images/logo.svg')" alt="Logo" />
              </a>
              <button
                class="navbar-toggler block focus:outline-none lg:hidden"
                type="button"
                data-toggle="collapse"
                data-target="#navbarOne"
                aria-controls="navbarOne"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="toggler-icon"></span>
                <span class="toggler-icon"></span>
                <span class="toggler-icon"></span>
              </button> -->
            <!-- <div
                id="navbarOne"
                class="collapse navbar-collapse top-100 mt-full absolute left-0 z-20 hidden w-full bg-white px-5 py-3 shadow duration-300 lg:static lg:block lg:w-auto lg:bg-transparent lg:shadow-none"
              >
                <ul id="nav" class="navbar-nav mr-auto content-start items-center lg:flex lg:justify-end">
                  <li class="nav-item active">
                    <a class="page-scroll" href="index.html#home">Home</a>
                  </li>
                  <li class="nav-item">
                    <a class="page-scroll" href="index.html#features">Features</a>
                  </li>
                  <li class="nav-item">
                    <a class="page-scroll" href="index.html#about">About</a>
                  </li>
                  <li class="nav-item">
                    <a class="page-scroll" href="index.html#facts">Why</a>
                  </li>
                  <li class="nav-item">
                    <a class="page-scroll" href="index.html#team">Team</a>
                  </li>
                  <li class="nav-item">
                    <a class="page-scroll" href="index.html#blog">Blog</a>
                  </li>
                </ul>
              </div>
              <div class="navbar-btn absolute right-0 mt-2 mr-24 hidden sm:inline-block lg:static lg:mt-0 lg:mr-0">
                <a class="main-btn gradient-btn" data-scroll-nav="0" href="index.html#" rel="nofollow">Download Now</a>
              </div> -->
            <!-- </nav> -->
          </div>
        </div>
      </div>
    </div>
    <div
      id="home"
      class="header-hero"
      :style="{
        'background-image': 'url(' + pathto('/landing/images/banner-bg.svg') + ')',
      }"
    >
      <div class="container">
        <div class="row justify-center">
          <div class="w-full lg:w-2/3">
            <div class="header-hero-content mb-12 pt-32 text-center lg:pt-48">
              <h3
                class="header-sub-title wow fadeInUp text-4xl font-light leading-tight text-white"
                data-wow-duration="1.3s"
                data-wow-delay="0.2s"
              >
                Welcome to Radar RMS
              </h3>
              <h2
                class="header-title wow fadeInUp mb-3 text-4xl font-bold text-white"
                data-wow-duration="1.3s"
                data-wow-delay="0.5s"
              ></h2>
              <p class="text wow fadeInUp mb-8 text-white" data-wow-duration="1.3s" data-wow-delay="0.8s"></p>
              <NLink class="main-btn gradient-btn" to="/login">Login Here</NLink>
              <!-- <a href="index.html#" class="main-btn gradient-btn gradient-btn-2 wow fadeInUp" data-wow-duration="1.3s" data-wow-delay="1.1s"
                >
                Get Started
                </a> -->
            </div>
          </div>
        </div>
        <div class="row justify-center">
          <div class="w-full lg:w-2/3">
            <div class="header-hero-image wow fadeIn text-center" data-wow-duration="1.3s" data-wow-delay="1.4s">
              <img :src="pathto('/landing/images/header-hero.png')" alt="hero" />
            </div>
          </div>
        </div>
      </div>
      <div id="particles-1" class="particles"></div>
    </div>
  </header>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
}
</script>

<style lang="scss" scoped></style>
