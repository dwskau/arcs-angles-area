#install.packages('dplyr')
#install.packages('tidyr')
library(dplyr)
library(tidyr)
library(gdata)
library(ggplot2)

# r doesn't have a standard error function
stderr = function(x) sqrt(var(x,na.rm=TRUE)/length(na.omit(x)))
ci95 = function(x) stderr(x) * 1.96

lowerCI <- function(v) {mean(v) - sd(v)*1.96/sqrt(length(v))}
upperCI <- function(v) {mean(v) + sd(v)*1.96/sqrt(length(v))}

setwd("~/github/arcs-angles-area/analysis/results")
#reshaped = read.csv("reshaped-unique.csv")
#demographics = read.csv("demographics.csv")

# aaa = merge(reshaped, demographics, by = "postID")
# remove participants due to incompleteness or comments left in the feedback form
# aaa = aaa[!(aaa$workerID %in% c("A149ROBL26JWP", "A237FGJCPV99G", "A2HHKBW8HQWI66", "A3RR85PK3AV9TU", "A1CIIX0CB0GR7H", "AQ2INPVVXR1G0", "AOW8XHXW76DSF", "A2WNW8A4MOR7T7", "A3J2UG22S8BIW4", "A1Z7J3XE1R8TYT")),]
# fix a single answer for participant A3P2LT53J1GUBG based on a comment in the feedback form
# aaa$correct_ans[aaa$correct_ans == 7068] <- 70

# categorize charts into thirds
# aaa$thirds <- ifelse(aaa$correct_ans < 33, "small", ifelse(aaa$correct_ans < 67, "medium", "large"))

# data was reshaped in Google Sheets, and opposite answer corrections were calculated here: https://docs.google.com/spreadsheets/d/1ykUK7l82OZAMIvE8jHLjqYt6GmsKuTl934qqgxZ2faE/edit?usp=sharing
aaa = read.csv("merged-data.csv") #aaa = arcs angles areas

# get the average result for condition 1 per subject (aaao = arcs angles areas opposite - includes opposite correction)
aaaoBaseline = aaa %>%
  #  filter(inner_radius == 0) %>%
  group_by(chart_type) %>%
  summarize(aaaoBaseline = mean(log_opposite))

# distribute the aggregated value to each row and normalize
aaa = aaa %>%
  left_join(aaaoBaseline) %>%
  mutate(aaaoNormalized = log_opposite / aaaoBaseline)

aaaoAggregated = aaa %>%
  group_by(chart_type, subjectID, Pie_Chart_Multiplle_Choice_2, sex, degree, age, Pie_Chart_Multiple_Choice_1, thirds) %>%
  summarize(aaa_ci95 = ci95(log_error),
            aaa_mean = mean(log_error),
            aaao_ci95 = ci95(log_opposite),
            aaao_mean = mean(log_opposite),
            aaao_timeci95 = ci95(time_diff_time_trial),
            aaao_time = mean(time_diff_time_trial))

ggplot(aaaoAggregated, aes(y=aaao_mean, x=chart_type, fill=factor(chart_type))) +
  geom_violin(size=1, aes(
    color=factor(chart_type),
    ymin=aaao_mean - aaao_ci95, 
    ymax=aaao_mean + aaao_ci95)) +
  stat_summary(fun.ymin=lowerCI, fun.ymax=upperCI, geom="errorbar", aes(width=.1)) +
  stat_summary(fun.y=mean, geom="point", shape=3, size=8, show.legend = FALSE) + 
  theme(legend.position="none") +
  labs(title = 'Distribution of Mean Error (with opposite correction)')

ggplot(aaaoAggregated, aes(y=aaa_mean, x=chart_type, fill=factor(chart_type))) +
  geom_violin(size=1, aes(
    color=factor(chart_type),
    ymin=aaa_mean - aaa_ci95, 
    ymax=aaa_mean + aaa_ci95)) +
  stat_summary(fun.ymin=lowerCI, fun.ymax=upperCI, geom="errorbar", aes(width=.1)) +
  stat_summary(fun.y=mean, geom="point", shape=3, size=8, show.legend = FALSE) + 
  theme(legend.position="none") +
  labs(title = 'Distribution of Mean Error (without opposite correction)')

summary(lm(log_error ~ chart_type, data=aaa))
aaa %>% group_by(chart_type) %>% summarize(meanError = mean(log_error), CI95 = sd(log_error)*1.96/sqrt(n()))

#ggplot(aaaoAggregated, aes(x=Pie_Chart_Multiplle_Choice_2, fill=factor(Pie_Chart_Multiplle_Choice_2))) +
#  geom_violin(size=1, aes(
#    y=aaao_mean, 
#    ymin=aaao_mean - aaao_ci95, 
#    ymax=aaao_mean + aaao_ci95)) +
#  stat_summary(fun.y=mean, geom="point", aes(y=aaao_mean), shape=18, size=4) + 
#  labs(title = 'aaao error')

ggplot(aaaoAggregated, aes(y=aaao_mean, x=Pie_Chart_Multiplle_Choice_2, fill=factor(Pie_Chart_Multiplle_Choice_2))) +
  geom_violin(size=1, aes(
    color=factor(chart_type),
    ymin=aaao_mean - aaao_ci95, 
    ymax=aaao_mean + aaao_ci95)) +
  stat_summary(fun.ymin=lowerCI, fun.ymax=upperCI, geom="errorbar", aes(width=.1)) +
  stat_summary(fun.y=mean, geom="point", shape=3, size=8, show.legend = FALSE) + 
  theme(legend.position="none") +
  labs(title = 'Distribution of Error Segmented by Visual Variable Preference') + 
  facet_grid(. ~ chart_type)

#ggplot(aaaoAggregated, aes(x=thirds, fill=factor(thirds))) +
#  geom_violin(size=1, aes(
#    y=aaao_mean, 
#    color=factor(chart_type),
#    ymin=aaao_mean - aaao_ci95, 
#    ymax=aaao_mean + aaao_ci95)) +
#  stat_summary(fun.y=mean, geom="point", aes(y=aaao_mean), shape=18, size=4) + 
#  labs(title = 'aaao error') + 
#  facet_grid(. ~ chart_type)

#ggplot(aaaoAggregated, aes(x=sex, fill=factor(sex))) +
#  geom_violin(size=1, aes(
#    y=aaao_mean, 
#    color=factor(chart_type),
#    ymin=aaao_mean - aaao_ci95, 
#    ymax=aaao_mean + aaao_ci95)) +
#  stat_summary(fun.y=mean, geom="point", aes(y=aaao_mean), shape=18, size=4) + 
#  labs(title = 'aaao error') + 
#  facet_grid(. ~ chart_type)

#ggplot(aaaoAggregated, aes(x=degree, fill=factor(degree))) +
#  geom_violin(size=1, aes(
#    y=aaao_mean, 
#    color=factor(chart_type),
#    ymin=aaao_mean - aaao_ci95, 
#    ymax=aaao_mean + aaao_ci95)) +
#  stat_summary(fun.y=mean, geom="point", aes(y=aaao_mean), shape=18, size=4) + 
#  labs(title = 'aaao error') + 
#  facet_grid(. ~ chart_type)

#ggplot(aaaoAggregated, aes(x=age, fill=factor(age))) +
#  geom_violin(size=1, aes(
#    y=aaao_mean, 
#    color=factor(chart_type),
#    ymin=aaao_mean - aaao_ci95, 
#    ymax=aaao_mean + aaao_ci95)) +
#  stat_summary(fun.y=mean, geom="point", aes(y=aaao_mean), shape=18, size=4) + 
#  labs(title = 'aaao error') + 
#  facet_grid(. ~ chart_type)

#ggplot(aaaoAggregated, aes(x=Pie_Chart_Multiple_Choice_1, fill=factor(Pie_Chart_Multiple_Choice_1))) +
#  geom_violin(size=1, aes(
#    y=aaao_mean, 
#    color=factor(chart_type),
#    ymin=aaao_mean - aaao_ci95, 
#    ymax=aaao_mean + aaao_ci95)) +
#  stat_summary(fun.y=mean, geom="point", aes(y=aaao_mean), shape=18, size=4) + 
#  labs(title = 'aaao error') + 
#  facet_grid(. ~ chart_type)

#ggplot(aaa, aes(x=log_opposite)) +
#  geom_histogram() +
#  facet_grid(Pie_Chart_Multiple_Choice_2 ~ .)

#ggplot(aaa, aes(x=log_opposite)) +
#  geom_histogram() +
#  facet_grid(Pie_Chart_Multiple_Choice_2 ~ .)