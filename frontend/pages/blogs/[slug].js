import Head from 'next/head';
import dynamic from 'next/dynamic';
import { isAuth } from '../../actions/auth'
import parse from 'html-react-parser';
import Link from 'next/link';
const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });
import { useState, useEffect } from 'react';
import { singleBlog, listRelated, getAllBlogSlugs } from '../../actions/blog';
import { DOMAIN, APP_NAME } from "../../config"
const SmallCard = dynamic(() => import('@/components/blog/SmallCard'), { ssr: false });
import styles from "../../styles/blogposts.module.css"
import { format } from 'date-fns';



const SingleBlog0 = ({ blog, errorCode }) => {

    if (errorCode) {
        return (
            <Layout>
                <div style={{ background: "#C1D6B1" }}>
                    <br /><br /><br />
                    <div className={styles.page404}>404 Error! Page Not Found</div>
                    {/* <section className={styles.item0000}> <br /> <Search /> <br /><br /><br /></section> */}
                </div>
            </Layout>
        );
    }



    const head = () => (
        <Head>
            <title >{`${blog.title} - ${APP_NAME}`}</title>

            <meta name="description" content={blog.mdesc} />
            <link rel="canonical" href={`${DOMAIN}/${blog.slug}`} />
            <meta property="og:title" content={`${blog.mtitle}| ${APP_NAME}`} />
            <meta property="og:description" content={blog.mdesc} />
            <meta property="og:type" content="webiste" />
            <meta name="robots" content="index, follow" />
            <meta property="og:url" content={`${DOMAIN}/${blog.slug}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={blog.photo} />
            <meta property="og:image:secure_url" ccontent={blog.photo} />
            <meta property="og:image:type" content="image/jpg" />

        </Head>
    );

    const [related, setRelated] = useState([]);

    const loadRelated = () => {
        listRelated({ blog }).then(data => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setRelated(data);
            }
        });
    };


    useEffect(() => {
        loadRelated();
    }, []);



    const showBlogCategories = blog =>
        blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`} className={styles.blogcat}>
                {c.name}
            </Link>
        ));

 


    const showRelatedBlog = () => {
        return (related && related.map((blog, i) => (

            <article key={i} className={styles.box}>
                <SmallCard blog={blog} />
            </article>

        )))
    };




    // Date Conversion
    const date = new Date(blog.date);
    const formattedDate = format(date, 'dd MMM, yyyy');

    return (

        <>

            {head()}
            <Layout >

                <main>
                    <article className={styles.backgroundImg}>
                        <br />


                        <section className={styles.mypost}>
                            <section className={styles.topsection}>

                                {isAuth() && isAuth().role === 1 && (<div className={styles.editbutton}><a href={`${DOMAIN}/admin/${blog.slug}`}>Edit</a></div>)}


                                <header className={styles.header}>
                                    <h1 >{blog.title}</h1>

                                    {/* <div className={styles.dateauth}>{formattedDate} &nbsp; by &nbsp; <Link href={`/profile/${blog.postedBy.username}`} className={styles.author}> {blog.postedBy.name}</Link>   </div> */}


                                    <section className={styles.dateauth}>
                                        {formattedDate} &nbsp; by &nbsp;
                                        {blog.postedBy && blog.postedBy.name && blog.postedBy.username ? (
                                            <a href={`/about`} className={styles.author}>
                                                {blog.postedBy.name}
                                            </a>
                                        ) : (
                                            <span>User</span>
                                        )}

                                    </section>
                                </header>

                                       

                                
                                    <section className={styles.imageContainer}>
                                        <div className={styles.aspectRatioContainer}>
                                            <img className={styles.resizeimg} src={blog.photo} alt={blog.title} />
                                        </div>
                                    </section>
                                



                                <br /><br />
                            </section>



                            <section className={styles.postcontent}>

                                {parse(blog.body)}

                                <div style={{ textAlign: "center" }}>
                                    <br /><br />
                                    {showBlogCategories(blog)}

                                </div>
                            </section>
                        </section>
                        <br />
                        <br />


                        <section className={styles.mypost2} >
                            <br />
                            {/* <section className={styles.comments}> {showComments()} </section>  <br /> */}

                            {/* <section className={styles.item0000}> <br /> <Search /> <br /> </section> */}

                            <section className={styles.grid}>{showRelatedBlog()}</section>
                            <br /> <br /><br /><br />
                        </section>

                    </article>
                </main>

            </Layout>
        </>
    );

};



export async function getStaticPaths() {
    // const slugs = await getAllBlogSlugs();

    // const paths = slugs.map((slugObject) => ({ params: { slug: slugObject.slug } }));
    // return { paths, fallback: "blocking" };


    const slugs = await getAllBlogSlugs();


  const excludedSlugs = ['/admin/edit-blogs', '/admin/blog', '/admin/category', '/admin/images'];
  const filteredSlugs = slugs.filter((slugObject) => !excludedSlugs.includes(slugObject.slug));
  const paths = filteredSlugs.map((slugObject) => ({ params: { slug: slugObject.slug } }));

  return { paths, fallback: "blocking" };
}


export async function getStaticProps({ params, res }) {
    try {
        const data = await singleBlog(params.slug);
        if (data.error) {
            return { props: { errorCode: 404 } };
        }
        return { props: { blog: data } };
    } catch (error) {
        console.error(error);
        return { props: { errorCode: 500 } };
    }
}


export default SingleBlog0;