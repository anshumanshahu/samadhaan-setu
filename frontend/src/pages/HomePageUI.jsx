import Section from "../components/Section";
import Carousel from "../layouts/home/Carousel";
import Search from "../components/Search";
import RecentResolved from "../layouts/home/RecentResolved";
import ServiceGrid from "../layouts/home/ServiceGrid";
import ServiceCard from "../layouts/home/ServiceCard";
import JoinUsCard from "../layouts/home/JoinUsCard";
import { FaCheckCircle, FaCheckSquare, FaUserCheck } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import SpecialityCards from "../layouts/home/SpecialityCard";
import Banners from "../layouts/home/Banners";

const HomePageUI = () => {
  return (
    <section className="bg-brand-green/10 pt-0 md:pt-5">
      <Carousel />
      <Search />

      <Section
        component={<ServiceGrid />}
        tag={"Categories"}
        icon={<FaCheckCircle />}
        title={
          <>
            What Would You Like{" "}
            <span className="text-brand-green font-bold">to Report?</span>
          </>
        }
        subtitle={"Choose a category to report a civic issue in your area"}
      />

      <Section
        component={<SpecialityCards />}
        tag={"Departments"}
        icon={<LuMapPin />}
        title={
          <>
            Browse By{" "}
            <span className="text-brand-green font-bold">Department</span>
          </>
        }
        subtitle={
          "Every complaint routes to the concerned civic department automatically"
        }
      />

      <ServiceCard />

      <Section
        component={<RecentResolved />}
        tag={"Resolved"}
        icon={<FaCheckSquare />}
        title={
          <>
            Recently{" "}
            <span className="text-brand-green font-bold">Resolved Issues</span>
          </>
        }
        subtitle={"Real complaints, resolved by real ward officers"}
      />

      <Banners />

      <Section
        component={<JoinUsCard />}
        tag={"For Officials"}
        icon={<FaUserCheck />}
        title={
          <>
            Join Samadhaan Setu &{" "}
            <span className="text-brand-green font-bold">Serve Your Ward</span>
          </>
        }
        subtitle={
          "Be part of a transparent civic network. Register as a ward officer to respond faster."
        }
      />
    </section>
  );
};

export default HomePageUI;